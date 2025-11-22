/**
 * Chat Module
 *
 * Centralized exports for all chat-related functionality.
 * Import from '@/lib/chat' for convenience.
 *
 * @example
 * ```typescript
 * import { sendMessage, createChat } from '@/lib/chat';
 * import { formatTimestamp, validateFile } from '@/lib/chat';
 * import { ChatContext, useChatContext } from '@/lib/chat';
 * ```
 */

// Chat context and state management
export * from './ChatContext';

// Chat operations (CRUD, messaging, file uploads)
export * from './chatOperations';

// Chat utility functions (formatting, validation)
export * from './chatUtils';
