'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { UserProfile, DailyLog, MealSuggestion, MealAnalysis, PlannedMeal } from '@/lib/types'
import {
  getDailyLog,
  saveDailyLog,
  saveMealToLog,
  fetchDailyLogFromSupabase,
  syncMealToSupabase,
  removeMealFromSupabase,
} from '@/lib/store'
import { getTotalConsumed, calculateRemainingCalories } from '@/lib/nutrition'
import { CalorieRing } from './calorie-ring'
import { MealCard } from './meal-card'
import { FALLBACK_FOOD_IMAGE_URL } from './suggestion-card'
import { SwipeableSuggestionStack } from './swipeable-suggestion-stack'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Beef, Wheat, Droplets, Leaf, Loader2, Check, RotateCcw, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface DashboardProps {
  profile: UserProfile
  onAddMeal: () => void
}

const DELETE_UNDO_MS = 5000
const PLANNED_UNDO_MS = 5000

function createMealFromSuggestion(suggestion: MealSuggestion): MealAnalysis {
  return {
    name: suggestion.name,
    calories: suggestion.calories,
    protein: suggestion.protein,
    carbs: suggestion.carbs,
    fat: suggestion.fat,
    fiber: 0,
    imageUrl: suggestion.imageUrl,
    items: [
      {
        name: suggestion.name,
        portion: '1 serving',
        calories: suggestion.calories,
        protein: suggestion.protein,
        carbs: suggestion.carbs,
        fat: suggestion.fat,
      },
    ],
    timestamp: new Date().toISOString(),
  }
}

function createPlannedMeal(suggestion: MealSuggestion): PlannedMeal {
  return {
    ...suggestion,
    plannedId:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  }
}

export function Dashboard({ profile, onAddMeal }: DashboardProps) {
  const [dailyLog, setDailyLog] = useState<DailyLog>(getDailyLog())
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([])
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([])
  const [undoMeal, setUndoMeal] = useState<PlannedMeal | null>(null)
  const [undoMealIndex, setUndoMealIndex] = useState<number | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const pendingDeleteTimers = useRef<Map<string, number>>(new Map())
  const plannedUndoTimer = useRef<number | null>(null)

  const consumed = getTotalConsumed(dailyLog.meals)
  const remaining = calculateRemainingCalories(profile.dailyCalorieTarget, consumed.calories)

  const fetchSuggestions = useCallback(async () => {
    setLoadingSuggestions(true)
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remainingCalories: remaining,
          preferences: profile.foodPreferences,
          profile,
          consumedToday: {
            calories: consumed.calories,
            protein: consumed.protein,
            carbs: consumed.carbs,
            fat: consumed.fat,
            fiber: consumed.fiber,
          },
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuggestions(data.suggestions)
      }
    } catch {
      // Silent fail for suggestions
    } finally {
      setLoadingSuggestions(false)
    }
  }, [
    remaining,
    profile,
    consumed.calories,
    consumed.protein,
    consumed.carbs,
    consumed.fat,
    consumed.fiber,
  ])

  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  useEffect(() => {
    let ignore = false
    const loadFromSupabase = async () => {
      const remoteLog = await fetchDailyLogFromSupabase(profile.email)
      if (remoteLog && !ignore) {
        setDailyLog((prev) => {
          const shouldUseRemote = remoteLog.meals.length >= prev.meals.length
          if (!shouldUseRemote) {
            return prev
          }
          saveDailyLog(remoteLog)
          return remoteLog
        })
      }
    }
    void loadFromSupabase()
    return () => {
      ignore = true
    }
  }, [profile.email])

  useEffect(() => {
    return () => {
      pendingDeleteTimers.current.forEach((timer) => window.clearTimeout(timer))
      pendingDeleteTimers.current.clear()
      if (plannedUndoTimer.current) {
        window.clearTimeout(plannedUndoTimer.current)
      }
    }
  }, [])

  const addSuggestionToDailyLog = async (suggestion: MealSuggestion) => {
    const meal = createMealFromSuggestion(suggestion)
    saveMealToLog(meal)
    const syncedMeal = await syncMealToSupabase(profile.email, meal)
    if (!syncedMeal) {
      toast.error('Meal was saved locally but failed to sync to Supabase. Check console logs.')
    }
    const updatedLog = getDailyLog()
    setDailyLog(updatedLog)
    toast.success(`Added ${suggestion.name} to your daily log!`)
  }

  const clearPlannedUndo = useCallback(() => {
    if (plannedUndoTimer.current) {
      window.clearTimeout(plannedUndoTimer.current)
      plannedUndoTimer.current = null
    }
    setUndoMeal(null)
    setUndoMealIndex(null)
  }, [])

  const removeSuggestion = useCallback((targetSuggestion: MealSuggestion) => {
    setSuggestions((prev) => {
      const suggestionIndex = prev.lastIndexOf(targetSuggestion)
      if (suggestionIndex === -1) return prev
      return prev.filter((_, index) => index !== suggestionIndex)
    })
  }, [])

  const startPlannedUndoTimer = () => {
    if (plannedUndoTimer.current) {
      window.clearTimeout(plannedUndoTimer.current)
    }

    plannedUndoTimer.current = window.setTimeout(() => {
      setUndoMeal(null)
      setUndoMealIndex(null)
      plannedUndoTimer.current = null
    }, PLANNED_UNDO_MS)
  }

  const handleRemoveMeal = (mealIndex: number) => {
    const mealToRemove = dailyLog.meals[mealIndex]
    if (!mealToRemove) return

    const updatedMeals = dailyLog.meals.filter((_, index) => index !== mealIndex)
    const updatedLog: DailyLog = { ...dailyLog, meals: updatedMeals }
    saveDailyLog(updatedLog)
    setDailyLog(updatedLog)

    const deleteKey = mealToRemove.id || `${mealToRemove.timestamp || Date.now()}-${mealIndex}-${Date.now()}`
    let canceled = false

    const timer = window.setTimeout(async () => {
      pendingDeleteTimers.current.delete(deleteKey)
      if (canceled || !mealToRemove.id) return
      const removed = await removeMealFromSupabase(mealToRemove.id)
      if (!removed) {
        toast.error('Failed to delete meal from Supabase. Check console logs.')
      }
    }, DELETE_UNDO_MS)

    pendingDeleteTimers.current.set(deleteKey, timer)

    toast('Meal removed from log', {
      duration: DELETE_UNDO_MS,
      action: {
        label: 'Undo',
        onClick: () => {
          canceled = true
          const pendingTimer = pendingDeleteTimers.current.get(deleteKey)
          if (pendingTimer) {
            window.clearTimeout(pendingTimer)
            pendingDeleteTimers.current.delete(deleteKey)
          }

          setDailyLog((prev) => {
            const restoredMeals = [...prev.meals]
            const restoreIndex = Math.min(mealIndex, restoredMeals.length)
            restoredMeals.splice(restoreIndex, 0, mealToRemove)
            const restoredLog: DailyLog = { ...prev, meals: restoredMeals }
            saveDailyLog(restoredLog)
            return restoredLog
          })
        },
      },
    })
  }

  const handleDiscardTopSuggestion = useCallback((suggestion: MealSuggestion) => {
    removeSuggestion(suggestion)
  }, [removeSuggestion])

  const handlePlanMeal = useCallback((suggestion: MealSuggestion) => {
    clearPlannedUndo()
    removeSuggestion(suggestion)
    setPlannedMeals((prev) => [...prev, createPlannedMeal(suggestion)])
  }, [clearPlannedUndo, removeSuggestion])

  const handleConsumePlannedMeal = async (plannedMeal: PlannedMeal) => {
    clearPlannedUndo()
    setPlannedMeals((prev) => prev.filter((meal) => meal.plannedId !== plannedMeal.plannedId))
    await addSuggestionToDailyLog(plannedMeal)
  }

  const handleRemovePlannedMeal = (plannedMeal: PlannedMeal) => {
    const mealIndex = plannedMeals.findIndex((meal) => meal.plannedId === plannedMeal.plannedId)
    if (mealIndex === -1) return

    setPlannedMeals((prev) => prev.filter((meal) => meal.plannedId !== plannedMeal.plannedId))
    setUndoMeal(plannedMeal)
    setUndoMealIndex(mealIndex)
    startPlannedUndoTimer()
  }

  const handleUndoPlannedMeal = () => {
    if (!undoMeal) return

    setPlannedMeals((prev) => {
      const restoredMeals = [...prev]
      const restoreIndex = undoMealIndex === null ? restoredMeals.length : Math.min(undoMealIndex, restoredMeals.length)
      restoredMeals.splice(restoreIndex, 0, undoMeal)
      return restoredMeals
    })

    clearPlannedUndo()
  }

  const handleGenerateNewMeal = async () => {
    if (!customPrompt.trim()) {
      toast.error('Enter a prompt before generating a new meal.')
      return
    }

    setIsRegenerating(true)

    try {
      const res = await fetch('/api/meals/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPrompt: customPrompt.trim(),
          currentMeals: suggestions,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data?.success || !data?.meal) {
        toast.error(data?.message || 'Failed to generate a new meal suggestion.')
        return
      }

      const regeneratedMeal: MealSuggestion = {
        ...data.meal,
        mealType: 'snack',
      }

      setSuggestions((prev) => [...prev, regeneratedMeal])
      setCustomPrompt('')
    } catch {
      toast.error('Failed to generate a new meal suggestion.')
    } finally {
      setIsRegenerating(false)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 21 || hour < 5) return 'Good night'
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }
  
  const greeting = getGreeting()

  return (
    <div dir="ltr" className="flex min-h-[100dvh] flex-col bg-background px-6 pb-24 pt-20">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-1 text-left">
        <p className="text-sm font-medium text-muted-foreground">{today}</p>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}{profile.name ? `, ${profile.name}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          What's on the menu today? Let's check your meal and build a daily plan together.
        </p>
      </div>

      {/* Calorie ring section */}
      <div className="mb-6 flex flex-col items-center">
        {dailyLog.meals.length > 0 ? (
          <>
            <CalorieRing consumed={consumed.calories} target={profile.dailyCalorieTarget} />
            <Button
              onClick={onAddMeal}
              variant="outline"
              className="mt-4 rounded-xl text-sm font-medium"
            >
              Log another meal
            </Button>
          </>
        ) : (
          <Card className="w-full max-w-sm rounded-2xl border-border bg-card p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">No calories logged yet today.</p>
            <Button onClick={onAddMeal} className="rounded-xl">
              <Camera className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </Card>
        )}

        {/* Macro summary */}
        <div className="mt-4 grid w-full max-w-xs grid-cols-2 gap-3">
          <Card className="flex flex-col items-center rounded-2xl border-border bg-card p-3">
            <Beef className="mb-1 h-4 w-4" style={{ color: 'oklch(0.52 0.1 155)' }} />
            <span className="text-lg font-bold text-foreground">{consumed.protein}g</span>
            <span className="text-[10px] text-muted-foreground">Protein</span>
          </Card>
          <Card className="flex flex-col items-center rounded-2xl border-border bg-card p-3">
            <Wheat className="mb-1 h-4 w-4" style={{ color: 'oklch(0.75 0.14 75)' }} />
            <span className="text-lg font-bold text-foreground">{consumed.carbs}g</span>
            <span className="text-[10px] text-muted-foreground">Carbs</span>
          </Card>
          <Card className="flex flex-col items-center rounded-2xl border-border bg-card p-3">
            <Droplets className="mb-1 h-4 w-4" style={{ color: 'oklch(0.72 0.14 40)' }} />
            <span className="text-lg font-bold text-foreground">{consumed.fat}g</span>
            <span className="text-[10px] text-muted-foreground">Fat</span>
          </Card>
          <Card className="flex flex-col items-center rounded-2xl border-border bg-card p-3">
            <Leaf className="mb-1 h-4 w-4" style={{ color: 'oklch(0.55 0.1 190)' }} />
            <span className="text-lg font-bold text-foreground">{consumed.fiber}g</span>
            <span className="text-[10px] text-muted-foreground">Fiber</span>
          </Card>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="mb-6">
        <h2 className="mb-3 text-base font-semibold text-foreground">Today's Meals</h2>
        {dailyLog.meals.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No meals logged today.</p>
            <p className="text-xs text-muted-foreground">Snap a photo to start tracking.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {dailyLog.meals.map((meal, i) => (
              <MealCard key={i} meal={meal} index={i} onRemove={() => handleRemoveMeal(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Suggested Next Meals */}
      <div className="mb-6">
        <h2 className="mb-3 text-base font-semibold text-foreground">Suggested Next Meals</h2>
        <Card className="mb-4 flex flex-col gap-3 rounded-2xl border-border bg-card p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Generate something different</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add a short prompt to steer the next meal suggestions.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Want something else? e.g. 'high protein vegan'"
              className="h-11 rounded-xl"
            />
            <Button
              onClick={handleGenerateNewMeal}
              disabled={isRegenerating}
              className="h-11 rounded-xl px-5"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </Card>

        {loadingSuggestions ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((n) => (
              <Card key={n} className="h-28 animate-pulse rounded-2xl border-border bg-muted" />
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {consumed.calories >= profile.dailyCalorieTarget
                ? 'Daily goal reached!'
                : 'No suggestions right now.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Swipe left to discard or right to plan your next meal.
            </p>
            <SwipeableSuggestionStack
              suggestions={suggestions}
              onDiscardTop={handleDiscardTopSuggestion}
              onPlanTop={handlePlanMeal}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">Planned Meals</h3>
            {plannedMeals.length > 0 ? (
              <span className="text-xs font-medium text-muted-foreground">
                {plannedMeals.length} planned
              </span>
            ) : null}
          </div>

          {undoMeal ? (
            <Card className="mb-3 flex flex-row items-center justify-between gap-3 rounded-2xl border-border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{undoMeal.name} removed</p>
                <p className="text-xs text-muted-foreground">Restore it to your planned meals list.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleUndoPlannedMeal} className="rounded-xl">
                <RotateCcw className="h-3.5 w-3.5" />
                Undo
              </Button>
            </Card>
          ) : null}

          {plannedMeals.length === 0 ? (
            <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Swipe right on a meal to plan it here.</p>
              <p className="text-xs text-muted-foreground">
                Checkmark adds its macros to today. The close button removes it without consuming.
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {plannedMeals.map((meal) => (
                <Card key={meal.plannedId} className="overflow-hidden rounded-2xl border-border bg-card p-0">
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={meal.imageUrl || FALLBACK_FOOD_IMAGE_URL}
                      alt={meal.name}
                      className="h-32 w-full object-cover sm:h-auto sm:w-36"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{meal.name}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meal.description}</p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-foreground">{meal.calories} kcal</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
                          P {meal.protein}g
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
                          C {meal.carbs}g
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
                          F {meal.fat}g
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon-sm"
                          className="rounded-full"
                          onClick={() => void handleConsumePlannedMeal(meal)}
                          aria-label={`Consume ${meal.name}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => handleRemovePlannedMeal(meal)}
                          aria-label={`Remove ${meal.name} from planned meals`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
