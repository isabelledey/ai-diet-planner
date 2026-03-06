import type { UserProfile, DailyLog, MealAnalysis } from './types'

const PROFILE_KEY = 'nutrisnap_profile'
const LOG_KEY_PREFIX = 'nutrisnap_log_'
const PENDING_MEAL_KEY = 'nutrisnap_pending_meal'

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(PROFILE_KEY)
  return data ? JSON.parse(data) : null
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function isOnboarded(): boolean {
  return getUserProfile() !== null
}

function getDateKey(date?: string): string {
  const d = date || new Date().toISOString().split('T')[0]
  return `${LOG_KEY_PREFIX}${d}`
}

export function getDailyLog(date?: string): DailyLog {
  if (typeof window === 'undefined') {
    return { date: date || new Date().toISOString().split('T')[0], meals: [], suggestions: [] }
  }
  const key = getDateKey(date)
  const data = localStorage.getItem(key)
  if (data) return JSON.parse(data)
  return {
    date: date || new Date().toISOString().split('T')[0],
    meals: [],
    suggestions: [],
  }
}

export function saveDailyLog(log: DailyLog): void {
  const key = getDateKey(log.date)
  localStorage.setItem(key, JSON.stringify(log))
}

export function saveMealToLog(meal: MealAnalysis, date?: string): void {
  const safeInt = (value: unknown) => {
    const n = Number(value)
    return Number.isFinite(n) ? Math.round(n) : 0
  }

  const log = getDailyLog(date)
  log.meals.push({
    ...meal,
    calories: safeInt(meal.calories),
    protein: safeInt(meal.protein),
    carbs: safeInt(meal.carbs),
    fat: safeInt(meal.fat),
    fiber: safeInt(meal.fiber),
    items: (meal.items || []).map((item) => ({
      ...item,
      calories: safeInt(item.calories),
      protein: safeInt(item.protein),
      carbs: safeInt(item.carbs),
      fat: safeInt(item.fat),
    })),
    timestamp: meal.timestamp || new Date().toISOString(),
  })
  saveDailyLog(log)
}

export function setPendingMeal(meal: MealAnalysis): void {
  localStorage.setItem(PENDING_MEAL_KEY, JSON.stringify(meal))
}

export function getPendingMeal(): MealAnalysis | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(PENDING_MEAL_KEY)
  return data ? JSON.parse(data) : null
}

export function clearPendingMeal(): void {
  localStorage.removeItem(PENDING_MEAL_KEY)
}

export function clearAppSession(): void {
  if (typeof window === 'undefined') return
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key === PROFILE_KEY || key === PENDING_MEAL_KEY || key.startsWith(LOG_KEY_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

export async function syncProfileToSupabase(profile: UserProfile): Promise<void> {
  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
  } catch {
    // Keep local storage as fallback if network/db is unavailable.
  }
}

export async function fetchDailyLogFromSupabase(email: string, date?: string): Promise<DailyLog | null> {
  try {
    const qs = new URLSearchParams({ email })
    if (date) qs.set('date', date)
    const res = await fetch(`/api/log?${qs.toString()}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.success) return null
    return data.log as DailyLog
  } catch {
    return null
  }
}

export async function syncMealToSupabase(
  email: string,
  meal: MealAnalysis,
  date?: string,
): Promise<MealAnalysis | null> {
  try {
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, meal, date }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.success) return null
    return data.meal as MealAnalysis
  } catch {
    return null
  }
}

export async function removeMealFromSupabase(mealId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/log/meal', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealId }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data.success)
  } catch {
    return false
  }
}
