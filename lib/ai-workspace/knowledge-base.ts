/**
 * Knowledge Base Loader
 * Centralized loading of knowledge base files for AI agents
 */

import glossary from './knowledge/domain-glossary.json'
import catalog from './knowledge/entity-catalog.json'
import examples from './knowledge/examples.json'

export const knowledgeBase = {
    glossary,
    catalog,
    examples
}

export type KnowledgeBase = typeof knowledgeBase

export function getKnowledgeBase() {
    return knowledgeBase
}
