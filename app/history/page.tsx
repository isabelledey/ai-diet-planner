'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { format, isSameDay, subDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUserProfile } from '@/lib/store'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  fats: number
  carbs: number
  fiber: number
  time: string
}

interface MealApiRow {
  id?: string
  name?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fats?: number
  fiber?: number
  timestamp?: string
  created_at?: string
  consumed_at?: string
}

export default function NutritionPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(new Date())
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(weekAnchorDate, 6 - i)
      return {
        key: format(day, 'yyyy-MM-dd'),
        label: format(day, 'EEE'),
        dateNumber: Number(format(day, 'd')),
        fullDate: day,
      }
    })
  }, [weekAnchorDate])

  useEffect(() => {
    const fetchHistoryForSelectedDate = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const supabase = createClient()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Supabase Error:', sessionError.message)
        }

        const sessionEmail = session?.user?.email ?? null
        const localProfile = getUserProfile()
        const email = sessionEmail || localProfile?.email || null

        if (!email) {
          setFoods([])
          setErrorMessage('Could not load history. Please try again.')
          return
        }

        const dateKey = format(selectedDate, 'yyyy-MM-dd')
        const res = await fetch(
          `/api/log?email=${encodeURIComponent(email)}&date=${encodeURIComponent(dateKey)}`,
          { cache: 'no-store' },
        )

        const payload = await res.json().catch(() => null)
        if (!res.ok || !payload?.success) {
          console.error('Supabase Error:', payload?.message ?? 'Failed to fetch /api/log')
          setFoods([])
          setErrorMessage('Could not load history. Please try again.')
          return
        }

        const data = (payload?.log?.meals ?? []) as MealApiRow[]
        
        const mapped: FoodItem[] = data.map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          name: item.name ?? 'Meal',
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          fats: Number(item.fats ?? item.fat) || 0,
          carbs: Number(item.carbs) || 0,
          fiber: Number(item.fiber) || 0,
          time: item.timestamp || item.created_at || item.consumed_at
            ? new Date(item.timestamp ?? item.created_at ?? item.consumed_at ?? '').toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : '--:--',
        }))

        setFoods(mapped)
      } catch (error) {
        console.error('Supabase Error:', error instanceof Error ? error.message : String(error))
        setFoods([])
        setErrorMessage('Could not load history. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHistoryForSelectedDate()
  }, [selectedDate])

  const calculateTotals = (items: FoodItem[]) => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fats: acc.fats + item.fats,
        carbs: acc.carbs + item.carbs,
        fiber: acc.fiber + item.fiber,
      }),
      { calories: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 },
    )
  }

  const totals = calculateTotals(foods)

  const handlePreviousWeek = () => {
    const nextSelectedDate = subDays(selectedDate, 7)
    const nextAnchorDate = subDays(weekAnchorDate, 7)
    setSelectedDate(nextSelectedDate)
    setWeekAnchorDate(nextAnchorDate)
  }

  const handleNextWeek = () => {
    const nextSelectedDate = subDays(selectedDate, -7)
    const nextAnchorDate = subDays(weekAnchorDate, -7)
    setSelectedDate(nextSelectedDate)
    setWeekAnchorDate(nextAnchorDate)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background/80 px-4 py-4 backdrop-blur-md">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back()
            } else {
              router.push('/')
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Nutrition History</h1>
        <div className="h-10 w-10" /> {/* Empty div for flex spacing */}
      </header>

      <main className="flex-1 pb-24">
        {/* Weekly Strip */}
        <div className="overflow-x-auto whitespace-nowrap px-4 py-4 scrollbar-hide">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousWeek}
              aria-label="Previous week"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-background text-foreground shadow-sm transition-colors hover:bg-primary/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {days.map((day) => {
              const active = isSameDay(day.fullDate, selectedDate)
              return (
                <div key={day.key} className="flex shrink-0 snap-center flex-col items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{day.label}</span>
                  <button
                    onClick={() => setSelectedDate(day.fullDate)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {day.dateNumber}
                  </button>
                </div>
              )
            })}
            </div>
            <button
              type="button"
              onClick={handleNextWeek}
              aria-label="Next week"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-background text-foreground shadow-sm transition-colors hover:bg-primary/5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 px-4 py-2">
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 dark:bg-primary/5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Calories
            </p>
            <div className="flex flex-col">
              <span className="text-lg font-bold">{totals.calories}</span>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 dark:bg-primary/5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Protein
            </p>
            <div className="flex flex-col">
              <span className="text-lg font-bold">{totals.protein}g</span>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 dark:bg-primary/5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Net Carbs
            </p>
            <div className="flex flex-col">
              <span className="text-lg font-bold">{totals.carbs}g</span>
            </div>
          </div>
        </div>

        {/* Meal Timeline */}
        <div className="px-4 py-6">
          <h2 className="mb-6 text-xl font-bold">Today's Meals</h2>
          
          <div className="relative space-y-8">
            {/* Timeline Vertical Line */}
            {foods.length > 0 && !isLoading && !errorMessage && (
              <div className="absolute bottom-2 left-[20px] top-2 w-px bg-slate-200 dark:bg-slate-800" />
            )}

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-xl bg-muted" />
                <div className="h-24 animate-pulse rounded-xl bg-muted" />
              </div>
            ) : errorMessage ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                {errorMessage}
              </div>
            ) : foods.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No meals recorded for this date.
              </div>
            ) : (
              foods.map((food, i) => (
                <div key={food.id} className="relative pl-12">
                  <div className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-primary">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold">{food.name}</h3>
                        <p className="text-sm text-muted-foreground">{food.time}</p>
                      </div>
                      <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-bold text-primary">
                        {food.calories} kcal
                      </span>
                    </div>
                    
                    <div className="flex gap-3 overflow-hidden rounded-xl border border-border bg-card">
                      <div className="flex flex-1 flex-col justify-center gap-1 p-3">
                         <div className="flex gap-4 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> P: {food.protein}g
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" /> C: {food.carbs}g
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-orange-400" /> F: {food.fats}g
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
