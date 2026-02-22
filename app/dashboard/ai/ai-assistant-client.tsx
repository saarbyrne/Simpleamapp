'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIChat } from '@/components/ai/ai-chat'
import { ConversationHistory } from '@/components/ai/conversation-history'
import { AISettings } from '@/components/ai/ai-settings'
import { MessageSquare, Settings } from 'lucide-react'

export function AIAssistantClient() {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>()
  const [key, setKey] = useState(0) // Used to force remount of AIChat
  const [activeView, setActiveView] = useState<'chat' | 'settings'>('chat')

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId)
    setKey(prev => prev + 1) // Force remount to load conversation
  }, [])

  const handleNewConversation = useCallback(() => {
    setCurrentConversationId(undefined)
    setKey(prev => prev + 1) // Force remount for new conversation
  }, [])

  return (
    <Card className="h-[calc(100vh-8rem)] flex overflow-hidden">
      {/* Conversation List - Left Panel */}
      <div className="w-80 border-r flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              size="sm"
              onClick={handleNewConversation}
              className="h-8"
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-hidden">
          <ConversationHistory
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>
      </div>

      {/* Main Content - Right Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with tabs */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {currentConversationId ? 'AI Chat' : 'AI Assistant'}
            </h1>
            <div className="flex gap-2">
              <Button
                variant={activeView === 'chat' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('chat')}
              >
                <MessageSquare className="h-4 w-4 me-2" />
                Chat
              </Button>
              <Button
                variant={activeView === 'settings' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('settings')}
              >
                <Settings className="h-4 w-4 me-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' ? (
            <AIChat
              key={key}
              conversationId={currentConversationId}
              onNewConversation={(id) => {
                setCurrentConversationId(id)
              }}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <AISettings />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
