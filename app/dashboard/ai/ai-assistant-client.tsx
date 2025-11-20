'use client'

import { useState } from 'react'
import { PageFrame } from '@/components/dashboard/page-frame'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIChat } from '@/components/ai/ai-chat'
import { ConversationHistory } from '@/components/ai/conversation-history'
import { AIInsights } from '@/components/ai/ai-insights'
import { AISettings } from '@/components/ai/ai-settings'
import { Sparkles, MessageSquare, Lightbulb, Settings } from 'lucide-react'

export function AIAssistantClient() {
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>()
  const [key, setKey] = useState(0) // Used to force remount of AIChat

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    setKey(prev => prev + 1) // Force remount to load conversation
  }

  const handleNewConversation = () => {
    setCurrentConversationId(undefined)
    setKey(prev => prev + 1) // Force remount for new conversation
  }

  return (
    <PageFrame padding="none">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 shrink-0 hidden lg:block">
          <ConversationHistory
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="border-b px-6 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">AI Assistant</h1>
                    <p className="text-sm text-muted-foreground">
                      Your intelligent team management companion
                    </p>
                  </div>
                </div>
              </div>

              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 m-0 border-0 p-0">
              <AIChat
                key={key}
                conversationId={currentConversationId}
                onNewConversation={(id) => {
                  setCurrentConversationId(id)
                }}
              />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 m-0 border-0 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <AIInsights />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 m-0 border-0 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <AISettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageFrame>
  )
}
