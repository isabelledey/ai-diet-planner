'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { PhotoCapture } from '@/components/photo-capture'
import { MealAnalysisDisplay } from '@/components/meal-analysis'
import { createClient } from '@/lib/supabase/client'
import { clearDemoSession, getDemoSessionEmailFromBrowser } from '@/lib/demo-session'
import { clearAppSession, getUserProfile, setPendingMeal } from '@/lib/store'
import type { MealAnalysis } from '@/lib/types'

export function AnalyzePageClient() {
  const router = useRouter()
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysis | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const syncAuthState = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setIsAuthenticated(Boolean(session) || Boolean(getUserProfile()) || Boolean(getDemoSessionEmailFromBrowser()))
      }
    }

    void syncAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(Boolean(session) || Boolean(getUserProfile()) || Boolean(getDemoSessionEmailFromBrowser()))
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleMealAnalyzed = (analysis: MealAnalysis, imageDataUrl: string) => {
    setCurrentImage(imageDataUrl)
    setCurrentAnalysis(analysis)
  }

  const handleAnalyzeAgain = () => {
    setCurrentAnalysis(null)
  }

  const handleContinue = () => {
    if (currentAnalysis) {
      setPendingMeal(currentAnalysis)
    }

    router.push('/?mode=signup')
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearDemoSession()
    clearAppSession()
    router.replace('/')
    router.refresh()
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md">
      <AppHeader onLogout={handleLogout} showLogout={isAuthenticated} />

      {currentAnalysis ? (
        <MealAnalysisDisplay
          analysis={currentAnalysis}
          imageUrl={currentImage || undefined}
          onContinue={handleContinue}
          onAnalyzeAgain={handleAnalyzeAgain}
        />
      ) : (
        <PhotoCapture
          onMealAnalyzed={handleMealAnalyzed}
          onBack={() => router.push(isAuthenticated ? '/dashboard' : '/')}
          initialImageDataUrl={currentImage}
        />
      )}
    </main>
  )
}
