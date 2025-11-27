import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { db } from '@/lib/db'
import { ArtifactType } from '@/lib/ai-workspace/types'

export async function POST(req: NextRequest) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await ensureUserWithOrganization(user)
    if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    try {
        const { prompt, artifactType, variables } = await req.json()

        if (!prompt || !artifactType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create a new AI Workspace session
        // We store the structured intent data in 'artifactData' initially
        const workspace = await db.aIWorkspace.create({
            data: {
                organizationId: dbUser.organizationId,
                userId: dbUser.id,
                name: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
                artifactType: artifactType as string,
                initialPrompt: prompt,
                status: 'draft',
                artifactData: {
                    intent: {
                        prompt,
                        variables,
                        artifactType
                    },
                    // Initialize empty config based on type
                    config: artifactType === 'reports' ? { sections: [] } :
                        artifactType === 'whiteboards' ? { elements: [], appState: {} } : {}
                },
                messages: {
                    create: [
                        {
                            role: 'user',
                            content: prompt,
                            isSystem: false
                        },
                        {
                            role: 'assistant',
                            content: `I've understood your intent to create a ${artifactType}. I've set up the initial workspace based on your requirements.`,
                            isSystem: true
                        }
                    ]
                }
            }
        })

        return NextResponse.json({ workspaceId: workspace.id })

    } catch (error) {
        console.error('Error accepting intent:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
