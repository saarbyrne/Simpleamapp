'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { getNotes, createNote, NotePrivacyLevel } from './notes'

/**
 * AI-powered note summarization
 * Summarizes notes for a given entity (person or event) within a date range
 */
export async function summarizeNotes(params: {
  linkedPersonId?: string
  linkedEventId?: string
  startDate?: Date
  endDate?: Date
  privacyLevel?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get notes with filters
    const filters: any = {}
    if (params.linkedPersonId) {
      filters.linkedPersonId = params.linkedPersonId
    }
    if (params.linkedEventId) {
      filters.linkedEventId = params.linkedEventId
    }
    if (params.privacyLevel) {
      filters.privacyLevel = params.privacyLevel
    }

    const result = await getNotes(filters)

    if (!result.success || !result.notes) {
      return { success: false, error: 'Failed to fetch notes for summarization' }
    }

    let notes = result.notes

    // Filter by date range if provided
    if (params.startDate || params.endDate) {
      notes = notes.filter((note) => {
        const noteDate = new Date(note.createdAt)
        if (params.startDate && noteDate < params.startDate) return false
        if (params.endDate && noteDate > params.endDate) return false
        return true
      })
    }

    if (notes.length === 0) {
      return {
        success: true,
        summary: 'No notes found matching the criteria.',
        notesCount: 0,
      }
    }

    // Extract text content from Tiptap JSON
    const extractText = (content: any): string => {
      if (!content) return ''
      if (typeof content === 'string') return content

      let text = ''
      if (content.type === 'text') {
        text = content.text || ''
      }
      if (content.content && Array.isArray(content.content)) {
        for (const child of content.content) {
          text += extractText(child) + ' '
        }
      }
      return text
    }

    // Prepare notes for AI summarization
    const notesText = notes.map((note) => {
      const textContent = extractText(note.content)
      return {
        id: note.id,
        title: note.title || '(No title)',
        content: textContent,
        author: note.author.name,
        date: new Date(note.createdAt).toLocaleDateString(),
        tags: note.tags,
      }
    })

    // In a real implementation, this would call an AI service (OpenAI, Claude, etc.)
    // For now, we'll create a structured summary
    const summary = generateStructuredSummary(notesText)

    return {
      success: true,
      summary,
      notesCount: notes.length,
      notes: notesText,
    }
  } catch (error) {
    console.error('Error summarizing notes:', error)
    return {
      success: false,
      error: 'Failed to summarize notes',
    }
  }
}

/**
 * Generate a structured summary from notes
 * In production, this would use AI (OpenAI, Claude API, etc.)
 */
function generateStructuredSummary(notes: any[]): string {
  // Extract common themes from tags
  const allTags = notes.flatMap((note) => note.tags)
  const tagCounts = allTags.reduce((acc: any, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  const topTags = Object.entries(tagCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0])

  // Count authors
  const authors = [...new Set(notes.map((note) => note.author))]

  // Build summary
  let summary = `Summary of ${notes.length} note${notes.length > 1 ? 's' : ''}:\n\n`

  summary += `**Contributors:** ${authors.join(', ')}\n\n`

  if (topTags.length > 0) {
    summary += `**Main Topics:** ${topTags.join(', ')}\n\n`
  }

  summary += `**Key Points:**\n`
  notes.slice(0, 5).forEach((note, idx) => {
    const preview = note.content.substring(0, 150)
    summary += `${idx + 1}. ${note.title} (${note.date}): ${preview}${note.content.length > 150 ? '...' : ''}\n`
  })

  if (notes.length > 5) {
    summary += `\n...and ${notes.length - 5} more note${notes.length - 5 > 1 ? 's' : ''}\n`
  }

  summary += `\n**Note:** This is a basic summary. For AI-powered insights, integrate with OpenAI or Anthropic Claude API.`

  return summary
}

/**
 * AI-powered note creation from natural language
 */
export async function createNoteFromNaturalLanguage(params: {
  prompt: string
  linkedPersonId?: string
  linkedEventId?: string
  privacyLevel?: NotePrivacyLevel
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // In a real implementation, this would use AI to:
    // 1. Parse the natural language prompt
    // 2. Extract title, content, tags
    // 3. Determine appropriate privacyLevel if not specified
    // 4. Format content properly

    // For now, we'll create a basic structured note
    const { title, content, tags } = parseNaturalLanguage(params.prompt)

    // Create the note
    const result = await createNote({
      title,
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content,
              },
            ],
          },
        ],
      },
      privacyLevel: params.privacyLevel || 'public',
      tags,
      linkedPersonId: params.linkedPersonId,
      linkedEventId: params.linkedEventId,
    })

    return result
  } catch (error) {
    console.error('Error creating note from natural language:', error)
    return {
      success: false,
      error: 'Failed to create note',
    }
  }
}

/**
 * Parse natural language to extract note components
 * In production, this would use AI (OpenAI, Claude API, etc.)
 */
function parseNaturalLanguage(prompt: string): {
  title: string
  content: string
  tags: string[]
} {
  // Very basic parsing - in production, use AI
  const lines = prompt.split('\n')
  const title = lines[0].substring(0, 100)
  const content = prompt
  const tags: string[] = []

  // Extract potential tags from common patterns
  const tagPatterns = [
    /training/i,
    /performance/i,
    /medical/i,
    /injury/i,
    /tactical/i,
    /mental/i,
    /physical/i,
  ]

  tagPatterns.forEach((pattern) => {
    if (pattern.test(prompt)) {
      const match = prompt.match(pattern)
      if (match) {
        tags.push(match[0].toLowerCase())
      }
    }
  })

  return { title, content, tags: [...new Set(tags)] }
}

/**
 * Analyze sentiment across notes
 */
export async function analyzeNotesSentiment(params: {
  linkedPersonId?: string
  linkedEventId?: string
  startDate?: Date
  endDate?: Date
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get notes
    const filters: any = {}
    if (params.linkedPersonId) {
      filters.linkedPersonId = params.linkedPersonId
    }
    if (params.linkedEventId) {
      filters.linkedEventId = params.linkedEventId
    }

    const result = await getNotes(filters)

    if (!result.success || !result.notes) {
      return { success: false, error: 'Failed to fetch notes for analysis' }
    }

    let notes = result.notes

    // Filter by date range
    if (params.startDate || params.endDate) {
      notes = notes.filter((note) => {
        const noteDate = new Date(note.createdAt)
        if (params.startDate && noteDate < params.startDate) return false
        if (params.endDate && noteDate > params.endDate) return false
        return true
      })
    }

    if (notes.length === 0) {
      return {
        success: true,
        analysis: 'No notes found for sentiment analysis.',
        notesCount: 0,
      }
    }

    // In production, this would use AI for sentiment analysis
    // For now, we'll do basic keyword analysis
    const analysis = performBasicSentimentAnalysis(notes)

    return {
      success: true,
      analysis,
      notesCount: notes.length,
    }
  } catch (error) {
    console.error('Error analyzing notes sentiment:', error)
    return {
      success: false,
      error: 'Failed to analyze notes sentiment',
    }
  }
}

/**
 * Basic sentiment analysis (would use AI in production)
 */
function performBasicSentimentAnalysis(notes: any[]): string {
  const positiveWords = ['great', 'excellent', 'good', 'improved', 'better', 'strong', 'positive']
  const negativeWords = ['poor', 'bad', 'worse', 'concerning', 'issue', 'problem', 'weak']

  let positiveCount = 0
  let negativeCount = 0

  notes.forEach((note) => {
    const text = JSON.stringify(note.content).toLowerCase()
    positiveWords.forEach((word) => {
      if (text.includes(word)) positiveCount++
    })
    negativeWords.forEach((word) => {
      if (text.includes(word)) negativeCount++
    })
  })

  let sentiment = 'Neutral'
  if (positiveCount > negativeCount * 1.5) {
    sentiment = 'Positive'
  } else if (negativeCount > positiveCount * 1.5) {
    sentiment = 'Negative'
  }

  return `Overall sentiment: ${sentiment}\n\nPositive indicators: ${positiveCount}\nNegative indicators: ${negativeCount}\n\n**Note:** This is basic keyword analysis. For advanced sentiment analysis, integrate with AI APIs.`
}
