import { db } from '@/lib/db'
import { OrgDataSource } from '@prisma/client'

export interface OrgContext {
    currentUser: {
        id: string
        name: string
        role: string
        roleAbbreviation: string | null
        reportsTo: {
            id: string
            name: string
            role: string
        } | null
    }
    colleagues: Array<{
        id: string
        name: string
        role: string
        roleAbbreviation: string | null
    }>
    dataSources: Array<{
        type: string
        availableMetrics: string[]
    }>
    players: Array<{
        id: string
        name: string
        position: string
        positionGroup: string
        status: string
    }>
    positionGroups: string[]
}

/**
 * Retrieves the organizational context for the AI agents.
 * This includes the current user's role, reporting structure, available data sources,
 * and a roster of players and colleagues.
 * 
 * @param orgId The organization ID
 * @param userId The current user ID
 * @returns Promise<OrgContext>
 */
export async function getOrgContext(orgId: string, userId: string): Promise<OrgContext> {
    // Fetch all required data in parallel for performance
    const [currentUser, colleagues, dataSources, players] = await Promise.all([
        db.user.findUnique({
            where: { id: userId },
            include: {
                reportsTo: {
                    select: {
                        id: true,
                        name: true,
                        roleNames: true,
                    }
                }
            }
        }),
        db.user.findMany({
            where: {
                organizationId: orgId,
                id: { not: userId } // Exclude current user
            },
            select: {
                id: true,
                name: true,
                roleNames: true,
                roleAbbreviation: true
            },
            take: 50 // Limit to avoid context window overflow
        }),
        db.orgDataSource.findMany({
            where: {
                organizationId: orgId,
                isActive: true
            }
        }),
        db.personOrganization.findMany({
            where: {
                organizationId: orgId,
                status: 'active'
            },
            include: {
                person: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            take: 100 // Limit to avoid context window overflow
        })
    ])

    if (!currentUser) {
        throw new Error('User not found')
    }

    // Extract unique position groups
    const positionGroups = Array.from(new Set(players.map(p => p.position).filter(Boolean) as string[]))

    return {
        currentUser: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.roleNames[0] || 'Staff', // Default to first role or Staff
            roleAbbreviation: currentUser.roleAbbreviation,
            reportsTo: currentUser.reportsTo ? {
                id: currentUser.reportsTo.id,
                name: currentUser.reportsTo.name,
                role: currentUser.reportsTo.roleNames[0] || 'Staff'
            } : null
        },
        colleagues: colleagues.map(c => ({
            id: c.id,
            name: c.name,
            role: c.roleNames[0] || 'Staff',
            roleAbbreviation: c.roleAbbreviation
        })),
        dataSources: dataSources.map(ds => ({
            type: ds.sourceType,
            availableMetrics: ds.availableMetrics
        })),
        players: players.map(p => ({
            id: p.personId,
            name: `${p.person.firstName} ${p.person.lastName}`,
            position: p.position || 'Unknown',
            positionGroup: p.position || 'Unknown', // Using position as group for now if no separate group field
            status: p.status
        })),
        positionGroups
    }
}
