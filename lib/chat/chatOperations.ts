import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  increment,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { Chat, Message } from '@/types/chat';
import { createClient } from '@/lib/supabase/client';

/**
 * Create a new chat (group or direct)
 */
export async function createChat(data: {
  orgId: string;
  type: 'group' | 'direct';
  name?: string;
  participantIds: string[];
  createdBy: string;
  creatorName: string;
}): Promise<string> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb(); // Lazy initialize Firebase

  // Ensure user is authenticated
  if (!auth.currentUser) {
    throw new Error('User not authenticated with Firebase');
  }

  try {
    // For direct chats, check if one already exists between these two users
    if (data.type === 'direct' && data.participantIds.length === 2) {
      const existingChat = await findDirectChat(data.orgId, data.participantIds);
      if (existingChat) {
        return existingChat.id;
      }
    }

    const chatRef = doc(collection(db, 'chats'));

    // Build chat data without undefined values (Firestore doesn't allow them)
    const chatData: any = {
      orgId: data.orgId,
      type: data.type,
      participantIds: data.participantIds,
      createdBy: data.createdBy,
      createdAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
    };

    // Only add name if it's provided (for group chats)
    if (data.name) {
      chatData.name = data.name;
    }

    await setDoc(chatRef, chatData);

    // Initialize unread counts for all participants
    const batch = writeBatch(db);
    data.participantIds.forEach(participantId => {
      const statusRef = doc(db, 'userChatStatus', participantId);
      batch.set(
        statusRef,
        {
          userId: participantId,
          [`chats.${chatRef.id}`]: {
            unreadCount: 0,
            lastReadAt: Timestamp.now(),
            isMuted: false,
          },
        },
        { merge: true }
      );
    });

    await batch.commit();

    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

/**
 * Find existing direct chat between two users
 */
async function findDirectChat(orgId: string, participantIds: string[]): Promise<Chat | null> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb(); // Lazy initialize Firebase

  // Ensure user is authenticated
  if (!auth.currentUser) {
    console.warn('User not authenticated with Firebase in findDirectChat');
    return null;
  }

  try {
    const q = query(
      collection(db, 'chats'),
      where('orgId', '==', orgId),
      where('type', '==', 'direct'),
      where('participantIds', 'array-contains', participantIds[0])
    );

    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
      const chat = { id: doc.id, ...doc.data() } as Chat;
      // Check if both users are participants
      if (chat.participantIds.includes(participantIds[1])) {
        return chat;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding direct chat:', error);
    return null;
  }
}

/**
 * Send a message to a chat
 */
export async function sendMessage(data: {
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}): Promise<string> {
  const db = getFirebaseDb(); // Lazy initialize Firebase
  try {
    // Build message object without undefined values (Firestore doesn't allow them)
    const messageData: any = {
      chatId: data.chatId,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      type: data.type || 'text',
      createdAt: serverTimestamp(),
      readBy: [data.senderId], // Sender has read it
    };

    // Only add file fields if they exist
    if (data.fileUrl) messageData.fileUrl = data.fileUrl;
    if (data.fileName) messageData.fileName = data.fileName;
    if (data.fileSize) messageData.fileSize = data.fileSize;

    const messageRef = await addDoc(collection(db, 'chats', data.chatId, 'messages'), messageData);

    // Update chat's last message
    const chatRef = doc(db, 'chats', data.chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        text: data.text,
        senderId: data.senderId,
        senderName: data.senderName,
      },
      lastMessageAt: serverTimestamp(),
    });

    // Get chat to find participants
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      const chat = chatSnap.data() as Chat;

      // Update unread counts for all participants except sender
      const batch = writeBatch(db);
      chat.participantIds.forEach(participantId => {
        if (participantId !== data.senderId) {
          const statusRef = doc(db, 'userChatStatus', participantId);
          batch.set(
            statusRef,
            {
              userId: participantId,
              [`chats.${data.chatId}.unreadCount`]: increment(1),
            },
            { merge: true }
          );
        }
      });
      await batch.commit();
    }

    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Mark a chat as read for a user
 */
export async function markChatAsRead(chatId: string, userId: string): Promise<void> {
  const db = getFirebaseDb(); // Lazy initialize Firebase
  try {
    const statusRef = doc(db, 'userChatStatus', userId);
    await updateDoc(statusRef, {
      [`chats.${chatId}.unreadCount`]: 0,
      [`chats.${chatId}.lastReadAt`]: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    throw error;
  }
}

/**
 * Upload a file to Supabase Storage and send as message
 * Uses Supabase Storage instead of Firebase Storage (no billing required)
 */
export async function uploadFile(data: {
  chatId: string;
  senderId: string;
  senderName: string;
  file: File;
  caption?: string;
}): Promise<string> {
  try {
    const supabase = createClient();
    const timestamp = Date.now();
    const fileName = `${timestamp}_${data.file.name}`;
    const filePath = `chats/${data.chatId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files') // Using existing 'files' bucket
      .upload(filePath, data.file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get file URL');
    }

    // Determine message type
    const messageType = data.file.type.startsWith('image/') ? 'image' : 'file';

    // Send message with file
    const messageId = await sendMessage({
      chatId: data.chatId,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.caption || data.file.name,
      type: messageType,
      fileUrl: urlData.publicUrl,
      fileName: data.file.name,
      fileSize: data.file.size,
    });

    return messageId;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a chat (soft delete)
 */
export async function deleteChat(chatId: string, userId: string): Promise<void> {
  const db = getFirebaseDb(); // Lazy initialize Firebase
  try {
    const statusRef = doc(db, 'userChatStatus', userId);
    await updateDoc(statusRef, {
      [`chats.${chatId}`]: null,
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}

/**
 * Leave a group chat
 */
export async function leaveChat(chatId: string, userId: string): Promise<void> {
  const db = getFirebaseDb(); // Lazy initialize Firebase
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (chatSnap.exists()) {
      const chat = chatSnap.data() as Chat;
      const newParticipants = chat.participantIds.filter(id => id !== userId);

      await updateDoc(chatRef, {
        participantIds: newParticipants,
      });

      // Remove from user's chat status
      await deleteChat(chatId, userId);
    }
  } catch (error) {
    console.error('Error leaving chat:', error);
    throw error;
  }
}
