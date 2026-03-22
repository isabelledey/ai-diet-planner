import { DashboardPageClient } from '@/components/dashboard-page-client'
import { getServerSessionState } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { email, isDemoSession } = await getServerSessionState()

  return <DashboardPageClient initialSessionEmail={email} isDemoSession={isDemoSession} />
}
