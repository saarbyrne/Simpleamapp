'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth/cached-user'
import { ArtifactType, WorkspaceStatus, ArtifactData, PublishDestination } from '@/lib/types/ai-workspace'

// ===== TYPES =====

export interface CreateWorkspaceData {
  prompt: string
  artifactType?: ArtifactType
}

export interface UpdateWorkspaceData {
  name?: string
  status?: WorkspaceStatus
  artifactData?: ArtifactData
  generatedContent?: any
}

export interface PublishWorkspaceData {
  destinations: PublishDestination[]
}

// ===== CREATE WORKSPACE =====

export async function createAIWorkspace(data: CreateWorkspaceData) {

  try {
    const user = await requireUser()

    // Infer artifact type from prompt if not provided
    const artifactType = data.artifactType || inferArtifactType(data.prompt)

    const workspace = await prisma.aIWorkspace.create({
      data: {
        name: generateWorkspaceName(data.prompt, artifactType),
        artifactType,
        status: 'draft',
        initialPrompt: data.prompt,
        userId: user.id,
        organizationId: user.organizationId,
      },
    })

    // Create initial system message
    await prisma.aIWorkspaceMessage.create({
      data: {
        workspaceId: workspace.id,
        role: 'user',
        content: data.prompt,
      },
    })

    revalidatePath('/dashboard/ai-workspace')

    return {
      success: true,
      workspace,
      workspaceId: workspace.id,
    }
  } catch (error) {
    console.error('Error creating AI workspace:', error)
    return { error: 'Failed to create workspace', success: false }
  }
}

// ===== GET WORKSPACES =====

export async function getAIWorkspaces() {

  try {
    const user = await requireUser()

    const workspaces = await prisma.aIWorkspace.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          take: 1, // Just get the first message for preview
        },
      },
    })

    return { success: true, workspaces }
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return { error: 'Failed to fetch workspaces', success: false }
  }
}

// ===== GET WORKSPACE BY ID =====

export async function getAIWorkspace(workspaceId: string) {

  try {
    const user = await requireUser()

    const workspace = await prisma.aIWorkspace.findFirst({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!workspace) {
      return { error: 'Workspace not found', success: false }
    }

    return { success: true, workspace }
  } catch (error) {
    console.error('Error fetching workspace:', error)
    return { error: 'Failed to fetch workspace', success: false }
  }
}

// ===== UPDATE WORKSPACE =====

export async function updateAIWorkspace(workspaceId: string, data: UpdateWorkspaceData) {

  try {
    const user = await requireUser()

    const workspace = await prisma.aIWorkspace.update({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.status && { status: data.status }),
        ...(data.artifactData && { artifactData: data.artifactData as any }),
        ...(data.generatedContent && { generatedContent: data.generatedContent as any }),
        version: { increment: 1 },
      },
    })

    revalidatePath('/dashboard/ai-workspace')
    revalidatePath(`/dashboard/ai-workspace/${workspaceId}`)

    return { success: true, workspace }
  } catch (error) {
    console.error('Error updating workspace:', error)
    return { error: 'Failed to update workspace', success: false }
  }
}

// ===== ADD MESSAGE =====

export async function addAIWorkspaceMessage(
  workspaceId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
) {

  try {
    const user = await requireUser()

    // Verify workspace belongs to user's organization
    const workspace = await prisma.aIWorkspace.findFirst({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
    })

    if (!workspace) {
      return { error: 'Workspace not found', success: false }
    }

    const message = await prisma.aIWorkspaceMessage.create({
      data: {
        workspaceId,
        role,
        content,
      },
    })

    return { success: true, message }
  } catch (error) {
    console.error('Error adding message:', error)
    return { error: 'Failed to add message', success: false }
  }
}

// ===== PUBLISH WORKSPACE =====

export async function publishAIWorkspace(workspaceId: string, data: PublishWorkspaceData) {

  try {
    const user = await requireUser()

    // 1. Fetch the workspace to get the artifact data
    const workspace = await prisma.aIWorkspace.findFirst({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
    })

    if (!workspace) {
      return { error: 'Workspace not found', success: false }
    }

    // 2. Materialize the artifact based on type
    const artifactData = workspace.artifactData as any
    const config = artifactData?.config

    if (!config) {
      return { error: 'No artifact configuration found to publish', success: false }
    }

    let publishedArtifactId: string | undefined

    if (workspace.artifactType === 'reports') {
      const { createReport } = await import('@/app/actions/reports')
      const result = await createReport({
        name: workspace.name,
        description: `Generated from AI Workspace: ${workspace.initialPrompt}`,
        type: 'dashboard', // Default to dashboard for now
        config: config
      })

      if (result.success && result.report) {
        publishedArtifactId = result.report.id
      } else {
        throw new Error(result.error || 'Failed to create report')
      }
    } else if (workspace.artifactType === 'whiteboards') {
      const { createDrawing } = await import('@/app/actions/drawings')
      const result = await createDrawing({
        name: workspace.name,
        description: `Generated from AI Workspace: ${workspace.initialPrompt}`,
        type: 'tactical',
        data: config, // Excalidraw data
        isPublic: true // Default to public within org
      })

      if (result.success && result.drawing) {
        publishedArtifactId = result.drawing.id
      } else {
        throw new Error(result.error || 'Failed to create drawing')
      }
    }

    // 3. Update workspace status
    const updatedWorkspace = await prisma.aIWorkspace.update({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
      data: {
        status: 'published',
        publishedAt: new Date(),
        publishedTo: data.destinations as any,
        // Store the ID of the created artifact for reference
        generatedContent: {
          ...((workspace.generatedContent as any) || {}),
          publishedArtifactId
        }
      },
    })

    revalidatePath('/dashboard/ai-workspace')
    revalidatePath(`/dashboard/ai-workspace/${workspaceId}`)

    return { success: true, workspace: updatedWorkspace }
  } catch (error) {
    console.error('Error publishing workspace:', error)
    return { error: 'Failed to publish workspace', success: false }
  }
}

// ===== DELETE WORKSPACE =====

export async function deleteAIWorkspace(workspaceId: string) {

  try {
    const user = await requireUser()

    await prisma.aIWorkspace.delete({
      where: {
        id: workspaceId,
        organizationId: user.organizationId,
      },
    })

    revalidatePath('/dashboard/ai-workspace')

    return { success: true }
  } catch (error) {
    console.error('Error deleting workspace:', error)
    return { error: 'Failed to delete workspace', success: false }
  }
}

// ===== HELPER FUNCTIONS =====

function inferArtifactType(prompt: string): ArtifactType {
  const lowerPrompt = prompt.toLowerCase()

  // Check for keywords to infer type
  if (lowerPrompt.includes('report') || lowerPrompt.includes('chart') || lowerPrompt.includes('graph') || lowerPrompt.includes('dashboard')) {
    return 'reports'
  }
  if (lowerPrompt.includes('whiteboard') || lowerPrompt.includes('tactics') || lowerPrompt.includes('formation') || lowerPrompt.includes('drawing')) {
    return 'whiteboards'
  }
  if (lowerPrompt.includes('plan') || lowerPrompt.includes('schedule') || lowerPrompt.includes('milestone') || lowerPrompt.includes('timeline')) {
    return 'plans'
  }
  if (lowerPrompt.includes('page') || lowerPrompt.includes('interface') || lowerPrompt.includes('view') || lowerPrompt.includes('ui')) {
    return 'uiPages'
  }

  // Default to reports
  return 'reports'
}

function generateWorkspaceName(prompt: string, artifactType: ArtifactType): string {
  // Take first 50 characters of prompt as name
  const baseName = prompt.slice(0, 50).trim()

  // If it ends mid-word, truncate to last complete word
  const lastSpace = baseName.lastIndexOf(' ')
  const name = lastSpace > 20 ? baseName.slice(0, lastSpace) : baseName

  return name || `New ${artifactType}`
}
