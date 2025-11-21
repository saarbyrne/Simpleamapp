# Firebase Chat System - Integration Guide

## Overview

A complete real-time chat system built with Firebase Firestore for SimpleAM. This guide explains how to integrate and configure the chat system.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Environment Variables](#environment-variables)
4. [Firebase Initialization](#firebase-initialization)
5. [Navigation Integration](#navigation-integration)
6. [Testing Checklist](#testing-checklist)
7. [Troubleshooting](#troubleshooting)
8. [Future Enhancements](#future-enhancements)

---

## Prerequisites

- Firebase project already created (`***REMOVED***`)
- Firestore database enabled
- Firebase Storage enabled
- Firebase Authentication enabled

---

## Firebase Setup

### 1. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `***REMOVED***`
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Copy your Firebase config values

### 2. Configure Firestore Security Rules

Your Firestore rules are already deployed at `firestore.rules`. Verify they include chat permissions:

```javascript
// Allow authenticated users to read/write their chats
match /chats/{chatId} {
  allow read: if request.auth != null &&
    request.auth.uid in resource.data.participantIds;
  allow create: if request.auth != null;
  allow update: if request.auth != null &&
    request.auth.uid in resource.data.participantIds;

  match /messages/{messageId} {
    allow read: if request.auth != null &&
      request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participantIds;
    allow create: if request.auth != null;
  }
}

match /userChatStatus/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 3. Configure Storage Rules

Your Storage rules are already deployed at `storage.rules`. Verify they allow chat uploads:

```javascript
match /chats/{chatId}/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
}
```

---

## Environment Variables

Add these to your `.env.local` file:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***REMOVED***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***REMOVED***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***REMOVED***.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**How to get these values:**
1. Firebase Console > Project Settings
2. Scroll to "Your apps"
3. If you don't have a web app, click "Add app" > Web
4. Copy the config object values

---

## Firebase Initialization

The chat system initializes Firebase automatically when you use the components. However, you should initialize Firebase Auth when your app starts.

### Add to your root layout or main app component:

```typescript
// In app/layout.tsx or _app.tsx
import { useEffect } from 'react';
import { initFirebaseAuth } from '@/lib/firebaseAuth';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize Firebase Auth on app mount
    initFirebaseAuth().catch(console.error);
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## Navigation Integration

### Add Chat Link to Your Sidebar/Navigation

The chat system is already accessible at `/dashboard/chat`. Add a navigation link:

```typescript
// In components/dashboard/app-sidebar.tsx or your navigation component

import { ChatNotificationBadge } from '@/components/chat/ChatNotificationBadge';
import { MessageSquare } from 'lucide-react';

// In your navigation items
{
  title: 'Messages',
  url: '/dashboard/chat',
  icon: MessageSquare,
  badge: <ChatNotificationBadge userId={currentUser.id} />
}
```

### Example Integration:

```typescript
import Link from 'next/link';
import { ChatNotificationBadge } from '@/components/chat/ChatNotificationBadge';

function Navigation({ userId }: { userId: string }) {
  return (
    <nav>
      <Link href="/dashboard/chat" className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <span>Messages</span>
        <ChatNotificationBadge userId={userId} />
      </Link>
    </nav>
  );
}
```

---

## Testing Checklist

Once integrated, test these features:

### Basic Functionality
- [ ] Navigate to `/dashboard/chat`
- [ ] See empty state "No messages yet"
- [ ] Click "New Chat" button
- [ ] Create a direct message with another user
- [ ] Create a group chat with multiple users
- [ ] Send text messages
- [ ] Receive messages in real-time (open in 2 tabs)

### File Uploads
- [ ] Upload an image (JPG, PNG, GIF)
- [ ] Upload a PDF document
- [ ] Upload an Excel file
- [ ] Verify file size limit (10MB max)
- [ ] Verify image displays as thumbnail
- [ ] Verify file displays with download button

### UI/UX
- [ ] Search chats by name
- [ ] Unread badge shows correct count
- [ ] Timestamp formats correctly ("2m ago", "Yesterday", etc.)
- [ ] Auto-scroll to bottom on new messages
- [ ] Mark as read when opening chat
- [ ] Press Enter to send message
- [ ] Press Shift+Enter for new line
- [ ] Mobile responsive layout

### Edge Cases
- [ ] Create direct chat with same person twice (should reuse existing)
- [ ] Handle network errors gracefully
- [ ] Empty message cannot be sent
- [ ] File upload progress shows
- [ ] Large file rejected with error message

---

## Troubleshooting

### Issue: "Firebase configuration not found"

**Solution:** Verify your `.env.local` file has all Firebase environment variables.

```bash
npm run dev
```

Check console for missing variables.

---

### Issue: "Permission denied" errors in Firestore

**Solution:** Redeploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Verify rules in Firebase Console > Firestore Database > Rules tab.

---

### Issue: "Storage bucket not found"

**Solution:** Enable Firebase Storage:

1. Go to Firebase Console > Storage
2. Click "Get Started"
3. Choose your security rules
4. Deploy storage rules:

```bash
firebase deploy --only storage
```

---

### Issue: Messages not appearing in real-time

**Solution:** Check Firebase Auth is initialized:

```typescript
import { initFirebaseAuth, getCurrentFirebaseUser } from '@/lib/firebaseAuth';

// Check if user is authenticated
const firebaseUser = getCurrentFirebaseUser();
console.log('Firebase user:', firebaseUser);
```

If `null`, ensure `initFirebaseAuth()` is called on app mount.

---

### Issue: "Cannot read property 'id' of undefined"

**Solution:** Ensure user data is loaded before rendering chat components:

```typescript
// Wait for user data
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login');

const dbUser = await ensureUserWithOrganization(user);
// Now dbUser has id, name, organizationId
```

---

## Current Limitations & Future Enhancements

### Current Limitations:

1. **Participant Selector:** Uses mock data. Need to integrate with actual user/team API.
2. **Authentication:** Uses anonymous auth. Should be replaced with custom token auth.
3. **Push Notifications:** Not implemented. Requires Cloud Functions.
4. **Read Receipts:** Basic implementation. Could show "seen by" list.
5. **Typing Indicators:** Not implemented.

### Planned Enhancements:

#### Phase 2: Push Notifications

Deploy Cloud Functions to send notifications:

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

See `functions/src/index.ts` for notification logic.

#### Phase 3: Custom Token Auth

Replace anonymous auth with Supabase-Firebase bridge:

```typescript
// Server-side: Generate custom token
import admin from 'firebase-admin';

const firebaseToken = await admin.auth().createCustomToken(supabaseUserId);

// Client-side: Sign in with custom token
import { signInWithCustomToken } from 'firebase/auth';

await signInWithCustomToken(auth, firebaseToken);
```

#### Phase 4: Advanced Features

- **Voice Messages:** Record and send audio
- **Video Calls:** Integrate WebRTC
- **Message Reactions:** Add emoji reactions
- **Thread Replies:** Reply to specific messages
- **Message Search:** Full-text search across chats
- **Chat Archives:** Archive/hide old chats
- **Admin Controls:** Moderation, chat deletion

---

## File Structure

```
lib/
├── firebase.ts                 # Firebase initialization
├── firebaseAuth.ts             # Auth helper functions
├── chatOperations.ts           # Core chat operations (CRUD)
├── chatUtils.ts                # Utility functions
└── ChatContext.tsx             # React context for chat

hooks/
├── useChats.ts                 # Hook to fetch user's chats
├── useMessages.ts              # Hook to fetch chat messages
├── useUnreadCount.ts           # Hook for unread badge count
└── useChatParticipants.ts      # Hook to fetch participant details

components/chat/
├── ChatList.tsx                # List of all chats
├── ChatWindow.tsx              # Message display and input
├── CreateChatModal.tsx         # Modal to create new chat
├── ChatNotificationBadge.tsx   # Unread count badge
└── FileUploadButton.tsx        # File upload component

app/dashboard/chat/
├── page.tsx                    # Chat list route
└── [chatId]/page.tsx           # Individual chat route

types/
└── chat.ts                     # TypeScript type definitions
```

---

## API Documentation

### Core Operations

#### `createChat()`

Create a new chat (group or direct):

```typescript
import { createChat } from '@/lib/chatOperations';

const chatId = await createChat({
  orgId: 'org_123',
  type: 'group', // or 'direct'
  name: 'Team Chat', // optional for direct chats
  participantIds: ['user1', 'user2', 'user3'],
  createdBy: 'user1',
  creatorName: 'John Doe',
});
```

#### `sendMessage()`

Send a text message:

```typescript
import { sendMessage } from '@/lib/chatOperations';

await sendMessage({
  chatId: 'chat_123',
  senderId: 'user1',
  senderName: 'John Doe',
  text: 'Hello team!',
});
```

#### `uploadFile()`

Upload and send a file:

```typescript
import { uploadFile } from '@/lib/chatOperations';

await uploadFile({
  chatId: 'chat_123',
  senderId: 'user1',
  senderName: 'John Doe',
  file: fileObject, // File object from input
  caption: 'Check this out', // optional
});
```

#### `markChatAsRead()`

Mark a chat as read:

```typescript
import { markChatAsRead } from '@/lib/chatOperations';

await markChatAsRead('chat_123', 'user1');
```

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify Firebase configuration in console
3. Check browser console for errors
4. Verify Firestore rules are deployed
5. Test with Firebase Emulator Suite for local development

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set Firebase environment variables in Vercel/production
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Configure Firebase Authentication providers
- [ ] Set up Firebase billing (Blaze plan) for Storage
- [ ] Configure CORS for Storage bucket
- [ ] Set up monitoring and alerts
- [ ] Test on production domain
- [ ] Configure custom token authentication (Phase 3)
- [ ] Deploy Cloud Functions for notifications (Phase 2)

---

## License

Part of SimpleAM platform. All rights reserved.
