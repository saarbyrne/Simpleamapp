/**
 * Knowledge Base Loader
 * Centralized loading of knowledge base files for AI agents
 */

import { readFileSync } from 'fs'
import { join } from 'path'

function loadKnowledgeBase() {
    try {
        const knowledgeDir = join(process.cwd(), 'lib', 'ai-workspace', 'knowledge')

        const glossary = JSON.parse(
            readFileSync(join(knowledgeDir, 'domain-glossary.json'), 'utf-8')
        )
        const catalog = JSON.parse(
            readFileSync(join(knowledgeDir, 'entity-catalog.json'), 'utf-8')
        )
        const examples = JSON.parse(
            readFileSync(join(knowledgeDir, 'examples.json'), 'utf-8')
        )

        return { glossary, catalog, examples }
    } catch (error) {
        console.error('[KnowledgeBase] Error loading knowledge base files:', error)
        throw new Error(`Failed to load knowledge base: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export const knowledgeBase = loadKnowledgeBase()

export type KnowledgeBase = ReturnType<typeof loadKnowledgeBase>

export function getKnowledgeBase() {
    return knowledgeBase
}
