import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { ensureUserWithOrganization } from '@/lib/auth/ensure-user'
import { PlayerProfile } from '@/components/players/player-profile'

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const dbUser = await ensureUserWithOrganization(user)

  // Fetch player with organization details
  const player = await prisma.person.findUnique({
    where: { id: params.id },
    include: {
      organizations: {
        where: {
          organizationId: dbUser.organizationId,
        },
        select: {
          position: true,
          jerseyNumber: true,
          status: true,
          tags: true,
          joinedAt: true,
        }
      }
    }
  })

  if (!player || player.organizations.length === 0) {
    notFound()
  }

  const org = player.organizations[0]

  return (
    <PlayerProfile
      player={{
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        dateOfBirth: player.dateOfBirth,
        nationality: player.nationality,
        phone: player.phone,
        email: player.email,
        photo: player.photo,
        position: org.position,
        jerseyNumber: org.jerseyNumber,
        status: org.status as 'active' | 'injured',
        tags: org.tags as string[],
        joinedAt: org.joinedAt,
      }}
    />
  )
}
