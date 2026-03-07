'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { format, isSameDay, subDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'
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

  const currentMonth = useMemo(() => format(weekAnchorDate, 'MMMM yyyy'), [weekAnchorDate])

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
          setErrorMessage('Error loading history.')
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
          setErrorMessage('Error loading history.')
          return
        }

        const data = (payload?.log?.meals ?? []) as MealApiRow[]
        console.log('Selected Date:', selectedDate)
        console.log('Fetched Data:', data)
        console.log('Raw JSON from Supabase:', data[0])

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
                hour12: false,
              })
            : '--:--',
        }))

        setFoods(mapped)
      } catch (error) {
        console.error('Supabase Error:', error instanceof Error ? error.message : String(error))
        setFoods([])
        setErrorMessage('Error loading history.')
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

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md bg-background">
      <AppHeader
        onGoBack={() => {
          if (window.history.length > 1) {
            router.back()
          } else {
            router.push('/')
          }
        }}
      />

      <div className="px-4 pb-8 pt-20">
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (window.history.length > 1) {
                router.back()
              } else {
                router.push('/')
              }
            }}
            className="rounded-xl"
          >
            Go Back
          </Button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setWeekAnchorDate((prev) => subDays(prev, 7))}
            className="rounded-lg p-2 hover:bg-secondary"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-semibold">{currentMonth}</h1>

          <button
            type="button"
            onClick={() => setWeekAnchorDate((prev) => subDays(prev, -7))}
            className="rounded-lg p-2 hover:bg-secondary"
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const active = isSameDay(day.fullDate, selectedDate)
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDate(day.fullDate)}
                className={`rounded-xl border px-1 py-2 text-center transition ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:bg-secondary'
                }`}
              >
                <div className="text-[11px]">{day.label}</div>
                <div className="text-sm font-semibold">{day.dateNumber}</div>
              </button>
            )
          })}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Meals</h2>
          <span className="text-sm text-muted-foreground">{format(selectedDate, 'PPP')}</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Error loading history.
          </div>
        ) : foods.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No meals recorded for this date.
          </div>
        ) : (
          <div className="space-y-3">
            {foods.map((food) => (
              <div key={food.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-muted-foreground">{food.time}</p>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{food.calories} kcal</p>
                <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <span>P {food.protein}g</span>
                  <span>F {food.fats}g</span>
                  <span>C {food.carbs}g</span>
                  <span>Fi {food.fiber}g</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Calories</p>
            <p className="text-2xl font-bold">{totals.calories} kcal</p>
          </div>
        )}
      </div>
    </main>
  )
}
