'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Trash2, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/components/ui/utils'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'

interface Conversation {
  id: string
  title: string
  preview: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

interface ConversationHistoryProps {
  currentConversationId?: string
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
}

export function ConversationHistory({
  currentConversationId,
  onSelectConversation,
  onNewConversation
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ConfirmDialogEl, confirmAction] = useConfirmDialog()

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/ai/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      } else if (response.status === 401) {
        // User not authenticated - just show empty state
        setConversations([])
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const ok = await confirmAction({
      title: 'Delete conversation?',
      description: 'This conversation will be permanently deleted.',
      confirmLabel: 'Delete',
    })
    if (!ok) return

    try {
      const response = await fetch(`/api/ai/conversations/${conversationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId))
        if (currentConversationId === conversationId) {
          onNewConversation()
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {ConfirmDialogEl}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start chatting with AI to see your history here
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'w-full text-start p-3 rounded-lg hover:bg-accent transition-colors group',
                  currentConversationId === conversation.id && 'bg-accent'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <h4 className="text-sm font-medium truncate">
                      {conversation.title || 'AI Conversation'}
                    </h4>
                  </div>
                  <span
                    role="button"
                    aria-label="Delete conversation"
                    className="h-6 w-6 p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-colors flex items-center justify-center"
                    onClick={(e) => handleDelete(conversation.id, e as unknown as React.MouseEvent)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {conversation.preview || 'No messages yet'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {conversation.messageCount} messages
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
