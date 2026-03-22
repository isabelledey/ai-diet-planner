import type { UserProfile } from '@/lib/types'

export const DEMO_OTP = '123456'
export const DEMO_SESSION_COOKIE = 'nutrisnap_demo_session'
const DEMO_SESSION_STORAGE_KEY = 'nutrisnap_demo_session'
const DEMO_SESSION_MAX_AGE = 60 * 60 * 8

export function isDevAuthBypassEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_DEMO_OTP === 'true' || process.env.NODE_ENV !== 'production'
}

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function createDefaultDemoProfile(
  email: string,
  overrides?: Partial<Pick<UserProfile, 'name'>>,
): UserProfile {
  return {
    email: normalizeAuthEmail(email),
    name: overrides?.name?.trim() || 'Demo User',
    age: 30,
    gender: 'other',
    height: 170,
    heightUnit: 'cm',
    weight: 70,
    weightUnit: 'kg',
    activityLevel: 'moderate',
    foodPreferences: ['high-protein', 'balanced'],
    goal: 'get_fit',
    dailyCalorieTarget: 2200,
  }
}

export function persistDemoSession(email: string): void {
  if (typeof window === 'undefined') return

  const normalizedEmail = normalizeAuthEmail(email)
  localStorage.setItem(DEMO_SESSION_STORAGE_KEY, normalizedEmail)
  document.cookie = `${DEMO_SESSION_COOKIE}=${encodeURIComponent(normalizedEmail)}; Path=/; Max-Age=${DEMO_SESSION_MAX_AGE}; SameSite=Lax`
}

export function clearDemoSession(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(DEMO_SESSION_STORAGE_KEY)
  localStorage.removeItem('demo_otp_email')
  localStorage.removeItem('demo_otp_mode')
  document.cookie = `${DEMO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function getDemoSessionEmailFromBrowser(): string | null {
  if (typeof window === 'undefined') return null
  if (!isDevAuthBypassEnabled()) return null

  const storedEmail = localStorage.getItem(DEMO_SESSION_STORAGE_KEY)
  if (storedEmail) {
    return normalizeAuthEmail(storedEmail)
  }

  const cookieValue = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${DEMO_SESSION_COOKIE}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  if (!cookieValue) {
    return null
  }

  const decodedValue = decodeURIComponent(cookieValue)
  localStorage.setItem(DEMO_SESSION_STORAGE_KEY, normalizeAuthEmail(decodedValue))
  return normalizeAuthEmail(decodedValue)
}

export function getDemoSessionEmailFromCookieValue(cookieValue?: string | null): string | null {
  if (!cookieValue || !isDevAuthBypassEnabled()) {
    return null
  }

  return normalizeAuthEmail(decodeURIComponent(cookieValue))
}
