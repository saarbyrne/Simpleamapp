import { NextRequest, NextResponse } from 'next/server'
import { getCachedUserWithOrganization } from '@/lib/auth/cached-user'
import { db } from '@/lib/db'
import { ArtifactType } from '@/lib/ai-workspace/types'

export async function POST(req: NextRequest) {
    const user = await getCachedUserWithOrganization()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
                organizationId: user.organizationId,
                userId: user.id,
                name: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
                artifactType: artifactType as string,
                initialPrompt: prompt,
                status: 'draft',
                structuredInputs: {
                    originalPrompt: prompt,
                    variables,
                    artifactType
                },
                artifactData: {
                    ...(artifactType === 'reports' ? { reportConfig: { sections: [] } } : {}),
                    ...(artifactType === 'whiteboards' ? { whiteboardConfig: { elements: [], appState: {} } } : {}),
                    ...(artifactType === 'uiPages' ? { uiPageConfig: { components: [], layout: 'grid' } } : {}),
                    ...(artifactType === 'plans' ? { planConfig: { milestones: [], phases: [] } } : {})
                },
                messages: {
                    create: [
                        {
                            role: 'user',
                            content: prompt,
                            isSystem: false
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
