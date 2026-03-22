import { redirect } from 'next/navigation'
import { AuthPageClient } from '@/components/auth-page-client'
import { getServerSessionState } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { email } = await getServerSessionState()

  if (email) {
    redirect('/dashboard')
  }

  return <AuthPageClient />
}
