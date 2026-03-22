'use client'

import { memo } from 'react'
import type { MealSuggestion } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Utensils, X } from 'lucide-react'

interface SuggestionCardProps {
  suggestion: MealSuggestion
  onAdd: (suggestion: MealSuggestion) => void
  onDelete: () => void
  showActions?: boolean
}

export const FALLBACK_FOOD_IMAGE_URL =
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'

export const SuggestionCard = memo(function SuggestionCard({
  suggestion,
  onAdd,
  onDelete,
  showActions = true,
}: SuggestionCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-border bg-card">
      <img
        src={suggestion.imageUrl || FALLBACK_FOOD_IMAGE_URL}
        alt={suggestion.name}
        className="h-40 w-full object-cover"
      />
      <div className="flex flex-col gap-3 p-4">
        {showActions ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${suggestion.name}`}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Utensils className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{suggestion.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{suggestion.description}</p>
          </div>
          <span className="shrink-0 text-sm font-bold text-foreground">{suggestion.calories} kcal</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
              P {suggestion.protein}g
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
              C {suggestion.carbs}g
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
              F {suggestion.fat}g
            </span>
          </div>
          {showActions ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAdd(suggestion)}
              className="h-8 rounded-xl text-xs font-medium"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
})
