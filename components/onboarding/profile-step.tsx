'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Loader2, Target, TrendingDown, Dumbbell, Heart } from 'lucide-react'
import type { UserProfile } from '@/lib/types'
import { calculateDailyCalorieTarget } from '@/lib/nutrition'
import { useTranslation } from '@/components/i18n/language-provider'

interface ProfileStepProps {
  onComplete: (profile: UserProfile) => void
}

const GOALS = [
  { value: 'lose_weight', labelKey: 'goal_lose_weight', descriptionKey: 'goal_lose_weight_desc', icon: TrendingDown },
  { value: 'maintain', labelKey: 'goal_maintain', descriptionKey: 'goal_maintain_desc', icon: Target },
  { value: 'build_muscle', labelKey: 'goal_build_muscle', descriptionKey: 'goal_build_muscle_desc', icon: Dumbbell },
  { value: 'get_fit', labelKey: 'goal_get_fit', descriptionKey: 'goal_get_fit_desc', icon: Heart },
] as const

const FOOD_PREF_KEYS = [
  'pref_no_restrictions',
  'pref_vegetarian',
  'pref_vegan',
  'pref_keto',
  'pref_paleo',
  'pref_gluten_free',
] as const

export function ProfileStep({ onComplete }: ProfileStepProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)

  // Page 1: basics
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [height, setHeight] = useState('')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')

  // Page 2: activity & preferences
  const [activityLevel, setActivityLevel] = useState<string>('')
  const [foodPreferences, setFoodPreferences] = useState<string[]>([])

  // Page 3: goal
  const [goal, setGoal] = useState<string>('')

  const noRestrictions = t('pref_no_restrictions')

  const togglePref = (pref: string) => {
    if (pref === noRestrictions) {
      setFoodPreferences([noRestrictions])
      return
    }
    setFoodPreferences((prev) => {
      const filtered = prev.filter((p) => p !== noRestrictions)
      return filtered.includes(pref)
        ? filtered.filter((p) => p !== pref)
        : [...filtered, pref]
    })
  }

  const canProceed1 = age && gender && height && weight
  const canProceed2 = activityLevel && foodPreferences.length > 0
  const canProceed3 = goal

  const handleComplete = () => {
    setLoading(true)

    const profile: UserProfile = {
      email: '',
      name: '',
      age: parseInt(age),
      gender: gender as 'male' | 'female' | 'other',
      height: parseFloat(height),
      heightUnit,
      weight: parseFloat(weight),
      weightUnit,
      activityLevel: activityLevel as UserProfile['activityLevel'],
      foodPreferences,
      goal: goal as UserProfile['goal'],
      dailyCalorieTarget: 0,
    }
    profile.dailyCalorieTarget = calculateDailyCalorieTarget(profile)

    setTimeout(() => {
      onComplete(profile)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex flex-1 flex-col py-6">
      {/* Page indicator dots */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[1, 2, 3].map((p) => (
          <div
            key={p}
            className={`h-2 rounded-full transition-all ${
              p === page ? 'w-6 bg-primary' : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      {page === 1 && (
        <div className="flex flex-1 flex-col">
          <h2 className="mb-1 text-2xl font-bold text-foreground">{t('profile_about_title')}</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t('profile_about_subtitle')}
          </p>

          <div className="flex flex-col gap-4">
            {/* Gender */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">{t('gender')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex h-11 items-center justify-center rounded-xl border text-sm font-medium capitalize transition-colors ${
                      gender === g
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-secondary'
                    }`}
                  >
                    {g === 'male' ? t('male') : g === 'female' ? t('female') : t('other')}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="age" className="text-sm font-medium text-foreground">{t('age')}</Label>
              <Input
                id="age"
                type="number"
                placeholder={t('age_placeholder')}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-12 rounded-xl text-base"
                min={10}
                max={120}
              />
            </div>

            {/* Height */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">{t('height')}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={heightUnit === 'cm' ? t('height_placeholder_cm') : t('height_placeholder_ft')}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-12 flex-1 rounded-xl text-base"
                  step={heightUnit === 'ft' ? 0.1 : 1}
                />
                <div className="flex overflow-hidden rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`flex h-12 w-12 items-center justify-center text-sm font-medium transition-colors ${
                      heightUnit === 'cm' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft')}
                    className={`flex h-12 w-12 items-center justify-center text-sm font-medium transition-colors ${
                      heightUnit === 'ft' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                    }`}
                  >
                    ft
                  </button>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">{t('weight')}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={weightUnit === 'kg' ? t('weight_placeholder_kg') : t('weight_placeholder_lbs')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 flex-1 rounded-xl text-base"
                  step={0.1}
                />
                <div className="flex overflow-hidden rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`flex h-12 w-12 items-center justify-center text-sm font-medium transition-colors ${
                      weightUnit === 'kg' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lbs')}
                    className={`flex h-12 w-14 items-center justify-center text-sm font-medium transition-colors ${
                      weightUnit === 'lbs' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Button
              onClick={() => setPage(2)}
              disabled={!canProceed1}
              className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
            >
              {t('continue')}
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="flex flex-1 flex-col">
          <h2 className="mb-1 text-2xl font-bold text-foreground">{t('profile_lifestyle_title')}</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t('profile_lifestyle_subtitle')}
          </p>

          <div className="flex flex-col gap-5">
            {/* Activity Level */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">{t('activity_level')}</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="h-12 w-full rounded-xl text-base">
                  <SelectValue placeholder={t('activity_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">{t('activity_sedentary')}</SelectItem>
                  <SelectItem value="light">{t('activity_light')}</SelectItem>
                  <SelectItem value="moderate">{t('activity_moderate')}</SelectItem>
                  <SelectItem value="active">{t('activity_active')}</SelectItem>
                  <SelectItem value="very_active">{t('activity_very_active')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Food Preferences */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">{t('food_preferences')}</Label>
              <div className="flex flex-wrap gap-2">
                {FOOD_PREF_KEYS.map((prefKey) => {
                  const pref = t(prefKey)
                  return (
                  <button
                    key={prefKey}
                    type="button"
                    onClick={() => togglePref(pref)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      foodPreferences.includes(pref)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:bg-secondary'
                    }`}
                  >
                    {pref}
                  </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setPage(1)}
              className="h-14 flex-1 rounded-2xl text-base font-medium"
            >
              {t('back')}
            </Button>
            <Button
              onClick={() => setPage(3)}
              disabled={!canProceed2}
              className="h-14 flex-1 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
            >
              {t('continue')}
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {page === 3 && (
        <div className="flex flex-1 flex-col">
          <h2 className="mb-1 text-2xl font-bold text-foreground">{t('profile_goal_title')}</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {t('profile_goal_subtitle')}
          </p>

          <div className="flex flex-col gap-3">
            {GOALS.map((g) => {
              const Icon = g.icon
              return (
                <Card
                  key={g.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => setGoal(g.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setGoal(g.value)}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                    goal === g.value
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      goal === g.value ? 'bg-primary/15' : 'bg-secondary'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${goal === g.value ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{t(g.labelKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(g.descriptionKey)}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-auto flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setPage(2)}
              className="h-14 flex-1 rounded-2xl text-base font-medium"
            >
              {t('back')}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!canProceed3 || loading}
              className="h-14 flex-1 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {t('complete')}
                  <ArrowRight className="ml-1 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
