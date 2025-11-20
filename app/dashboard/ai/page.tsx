import { Metadata } from 'next'
import { AIAssistantClient } from './ai-assistant-client'

export const metadata: Metadata = {
  title: 'AI Assistant | SimpleAM',
  description: 'AI-powered assistant for team management'
}

export default function AIAssistantPage() {
  return <AIAssistantClient />
}
