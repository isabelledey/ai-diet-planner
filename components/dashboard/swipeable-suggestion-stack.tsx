'use client'

import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { MealSuggestion } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Heart, X } from 'lucide-react'
import { SuggestionCard } from './suggestion-card'

const SWIPE_THRESHOLD_PX = 100
const STACK_OFFSET_PX = 14
const STACK_SCALE_STEP = 0.035
const MAX_VISIBLE_CARDS = 3
const EXIT_DISTANCE_PX = 520
const EXIT_DURATION_MS = 180

type SwipeDirection = 'left' | 'right'

interface SwipeableSuggestionStackProps {
  suggestions: MealSuggestion[]
  onDiscardTop: (suggestion: MealSuggestion) => void
  onPlanTop: (suggestion: MealSuggestion) => void
}

export const SwipeableSuggestionStack = memo(function SwipeableSuggestionStack({
  suggestions,
  onDiscardTop,
  onPlanTop,
}: SwipeableSuggestionStackProps) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null)
  const [cardHeight, setCardHeight] = useState(360)
  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const exitTimerRef = useRef<number | null>(null)
  const topCardRef = useRef<HTMLDivElement | null>(null)

  const visibleSuggestions = suggestions.slice(-MAX_VISIBLE_CARDS)
  const activeSuggestion = visibleSuggestions[visibleSuggestions.length - 1]

  useEffect(() => {
    setDragX(0)
    setIsDragging(false)
    setExitDirection(null)
  }, [activeSuggestion, suggestions.length])

  useEffect(() => {
    const node = topCardRef.current
    if (!node) return

    const measure = () => {
      setCardHeight(node.getBoundingClientRect().height || 360)
    }

    measure()

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [activeSuggestion, suggestions.length])

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current)
      }
    }
  }, [])

  const resetDrag = () => {
    setDragX(0)
    setIsDragging(false)
    pointerIdRef.current = null
  }

  const completeSwipe = (direction: SwipeDirection, currentMeal: MealSuggestion | undefined = activeSuggestion) => {
    if (!currentMeal || exitDirection) return

    setExitDirection(direction)
    setIsDragging(false)
    pointerIdRef.current = null

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current)
    }

    exitTimerRef.current = window.setTimeout(() => {
      if (direction === 'left') {
        onDiscardTop(currentMeal)
      } else {
        onPlanTop(currentMeal)
      }
    }, EXIT_DURATION_MS)
  }

  const handleDiscard = () => {
    completeSwipe('left', activeSuggestion)
  }

  const handlePlan = () => {
    completeSwipe('right', activeSuggestion)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!activeSuggestion || exitDirection) return

    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId || exitDirection) return
    setDragX(event.clientX - startXRef.current)
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const deltaX = event.clientX - startXRef.current
    setDragX(deltaX)

    if (deltaX > SWIPE_THRESHOLD_PX) {
      handlePlan()
      return
    }

    if (deltaX < -SWIPE_THRESHOLD_PX) {
      handleDiscard()
      return
    }

    resetDrag()
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full overflow-hidden">
        {visibleSuggestions.map((suggestion, index) => {
          const depthFromTop = visibleSuggestions.length - 1 - index
          const isTopCard = index === visibleSuggestions.length - 1
          const stackedTranslateY = depthFromTop * STACK_OFFSET_PX
          const stackedScale = 1 - depthFromTop * STACK_SCALE_STEP
          const rotation = isTopCard ? dragX / 18 : 0
          const swipeOpacity = isTopCard ? Math.max(0.8, 1 - Math.abs(dragX) / 420) : 1 - depthFromTop * 0.08

          let transform = `translate3d(0px, ${stackedTranslateY}px, 0px) scale(${stackedScale})`

          if (isTopCard) {
            if (exitDirection) {
              const exitX = exitDirection === 'right' ? EXIT_DISTANCE_PX : -EXIT_DISTANCE_PX
              transform = `translate3d(${exitX}px, ${stackedTranslateY}px, 0px) rotate(${exitDirection === 'right' ? 20 : -20}deg) scale(${stackedScale})`
            } else {
              transform = `translate3d(${dragX}px, ${stackedTranslateY}px, 0px) rotate(${rotation}deg) scale(${stackedScale})`
            }
          }

          return (
            <div
              key={`${suggestion.name}-${index}-${suggestion.calories}`}
              ref={isTopCard ? topCardRef : undefined}
              className="absolute inset-0 w-full"
              style={{
                zIndex: isTopCard ? MAX_VISIBLE_CARDS + 1 : index + 1,
                opacity: exitDirection && isTopCard ? 0 : swipeOpacity,
                pointerEvents: isTopCard ? 'auto' : 'none',
                transform,
                transition: isDragging
                  ? 'none'
                  : `transform ${EXIT_DURATION_MS}ms ease, opacity ${EXIT_DURATION_MS}ms ease`,
                touchAction: isTopCard ? 'pan-y' : 'auto',
                willChange: isTopCard ? 'transform, opacity' : 'auto',
              }}
              onPointerDown={isTopCard ? handlePointerDown : undefined}
              onPointerMove={isTopCard ? handlePointerMove : undefined}
              onPointerUp={isTopCard ? handlePointerEnd : undefined}
              onPointerCancel={isTopCard ? resetDrag : undefined}
            >
              <SuggestionCard
                suggestion={suggestion}
                onAdd={handlePlan}
                onDelete={handleDiscard}
                showActions={false}
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-2"
          onClick={handleDiscard}
          disabled={!activeSuggestion || Boolean(exitDirection)}
          aria-label="Discard meal"
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          type="button"
          size="icon-lg"
          className="h-14 w-14 rounded-full"
          onClick={handlePlan}
          disabled={!activeSuggestion || Boolean(exitDirection)}
          aria-label="Plan meal"
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
})
