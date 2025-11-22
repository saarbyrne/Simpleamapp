# Chat Module

Firebase-based real-time chat functionality for team communication.

## File Structure

- **`ChatContext.tsx`** - React context for chat state management
- **`chatOperations.ts`** - CRUD operations for chats and messages
- **`chatUtils.ts`** - Utility functions for formatting and validation
- **`index.ts`** - Centralized exports for convenience

## Usage

Import chat functionality from the main module:

```typescript
// Chat operations
import { createChat, sendMessage, uploadFile, markChatAsRead } from '@/lib/chat';

// Chat utilities
import { formatTimestamp, formatFileSize, validateFile } from '@/lib/chat';

// Chat context
import { ChatContext, useChatContext } from '@/lib/chat';
```

## Core Functionality

### Chat Operations (`chatOperations.ts`)

**Creating Chats:**
```typescript
const chatId = await createChat({
  participantIds: ['user1', 'user2'],
  isGroup: false,
  name: 'Direct Message'
});
```

**Sending Messages:**
```typescript
await sendMessage(chatId, {
  content: 'Hello!',
  senderId: currentUserId
});
```

**File Uploads:**
```typescript
const fileUrl = await uploadFile(file, chatId);
await sendMessage(chatId, {
  content: 'Shared a file',
  senderId: currentUserId,
  fileUrl,
  fileName: file.name,
  fileSize: file.size
});
```

**Mark as Read:**
```typescript
await markChatAsRead(chatId, userId);
```

### Chat Utilities (`chatUtils.ts`)

**Formatting:**
- `formatTimestamp()` - Format message timestamps
- `formatFileSize()` - Format file sizes (KB, MB)
- `truncateText()` - Truncate long text with ellipsis
- `getOtherParticipantName()` - Get display name for DMs

**Validation:**
- `validateFile()` - Validate file size and type
- `isImageFile()` - Check if file is an image

### Chat Context (`ChatContext.tsx`)

Provides global chat state and real-time updates:

```typescript
const {
  chats,
  unreadCount,
  isLoading
} = useChatContext();
```

## Related Hooks

Located in `/hooks`:
- `useChats()` - Real-time chat list
- `useMessages()` - Real-time messages for a chat
- `useChatParticipants()` - Chat participant management
- `useUnreadCount()` - Unread message counts

## Firebase Integration

Chats are stored in Firestore with the following structure:

```
/chats/{chatId}
  - participants: string[]
  - lastMessage: string
  - lastMessageAt: Timestamp
  - isGroup: boolean
  - name?: string

  /messages/{messageId}
    - content: string
    - senderId: string
    - createdAt: Timestamp
    - fileUrl?: string
    - fileName?: string
    - fileSize?: number
```

## Best Practices

1. **Real-time Updates** - Use hooks for automatic UI updates
2. **Error Handling** - Always wrap operations in try-catch
3. **Optimistic Updates** - Update UI immediately, sync later
4. **File Size Limits** - Validate files before upload (default 10MB)
5. **Security** - Validate user permissions before operations
