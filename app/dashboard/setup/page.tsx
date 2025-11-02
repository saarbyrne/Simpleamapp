import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createOrganizationForUser } from '@/app/actions/auth'

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user metadata from signup
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const organizationName = user.user_metadata?.organization_name || `${userName}'s Organization`

  // Create organization and user
  const result = await createOrganizationForUser(organizationName, userName)

  if (result.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Setup Failed</h1>
          <p className="mt-2 text-gray-600">{result.error}</p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            Try again
          </a>
        </div>
      </div>
    )
  }

  // Redirect to dashboard
  redirect('/dashboard')
}
