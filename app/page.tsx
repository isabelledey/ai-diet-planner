'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AppStep, UserProfile, MealAnalysis } from '@/lib/types'
import {
  getUserProfile,
  saveUserProfile,
  isOnboarded,
  saveMealToLog,
  setPendingMeal,
  getPendingMeal,
  clearPendingMeal,
  clearAppSession,
  syncProfileToSupabase,
  syncMealToSupabase,
} from '@/lib/store'
import { LandingHero } from '@/components/landing-hero'
import { PhotoCapture } from '@/components/photo-capture'
import { MealAnalysisDisplay } from '@/components/meal-analysis'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { Dashboard } from '@/components/dashboard/dashboard'
import { toast } from 'sonner'

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<AppStep>('landing')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysis | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Check if user is already onboarded
  useEffect(() => {
    if (isOnboarded()) {
      const savedProfile = getUserProfile()
      if (savedProfile) {
        setProfile(savedProfile)
        setStep('dashboard')
      }
    }
  }, [])

  const handleStart = () => {
    setStep('photo')
  }

  const runAnalysis = async (realBase64String: string) => {
    setIsAnalyzing(true)

    try {
      console.log('First 50 chars of image:', realBase64String.substring(0, 50))
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: realBase64String }),
      })
      const data = await res.json()

      if (data.success) {
        setCurrentAnalysis(data.analysis)
        setStep('analysis')
      } else {
        toast.error('Failed to analyze your meal. Please try again.')
        setStep('photo')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
      setStep('photo')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePhotoCapture = async (realBase64String: string) => {
    setCurrentImage(realBase64String)
    await runAnalysis(realBase64String)
  }

  const handleAnalyzeAgain = async () => {
    if (!currentImage) {
      toast.error('No meal image found. Please upload the photo again.')
      setStep('photo')
      return
    }
    await runAnalysis(currentImage)
  }

  const handleAnalysisContinue = async () => {
    if (currentAnalysis) {
      // Save the pending meal for after onboarding
      setPendingMeal(currentAnalysis)
    }

    if (isOnboarded() && profile) {
      // Already onboarded, save directly
      if (currentAnalysis) {
        const mealWithTimestamp = {
          ...currentAnalysis,
          timestamp: currentAnalysis.timestamp || new Date().toISOString(),
        }
        saveMealToLog(mealWithTimestamp)
        await syncMealToSupabase(profile.email, mealWithTimestamp)
        clearPendingMeal()
        toast.success('Meal saved to your daily log!')
      }
      setStep('dashboard')
    } else {
      // Need to onboard first
      setStep('onboarding-email')
    }
  }

  const handleOnboardingComplete = async (completedProfile: UserProfile) => {
    saveUserProfile(completedProfile)
    setProfile(completedProfile)
    await syncProfileToSupabase(completedProfile)

    // Save any pending meal
    const pending = getPendingMeal()
    if (pending) {
      const mealWithTimestamp = {
        ...pending,
        timestamp: pending.timestamp || new Date().toISOString(),
      }
      saveMealToLog(mealWithTimestamp)
      await syncMealToSupabase(completedProfile.email, mealWithTimestamp)
      clearPendingMeal()
      toast.success('Profile created and meal saved!')
    } else {
      toast.success('Profile created! Start tracking your meals.')
    }

    setStep('dashboard')
  }

  const handleAddMeal = () => {
    setCurrentAnalysis(null)
    setCurrentImage(null)
    setStep('photo')
  }

  const handleLogout = () => {
    clearAppSession()
    setProfile(null)
    setCurrentAnalysis(null)
    setCurrentImage(null)
    setIsAnalyzing(false)
    setStep('landing')
    router.replace('/')
  }

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md">
      {step === 'landing' && <LandingHero onStart={handleStart} />}

      {step === 'photo' && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onBack={() => setStep(profile ? 'dashboard' : 'landing')}
          isAnalyzing={isAnalyzing}
        />
      )}

      {step === 'analysis' && currentAnalysis && (
        <MealAnalysisDisplay
          analysis={currentAnalysis}
          imageUrl={currentImage || undefined}
          onContinue={handleAnalysisContinue}
          onAnalyzeAgain={handleAnalyzeAgain}
          isAnalyzing={isAnalyzing}
        />
      )}

      {(step === 'onboarding-email' || step === 'onboarding-verify' || step === 'onboarding-profile') && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}

      {step === 'dashboard' && profile && (
        <Dashboard profile={profile} onAddMeal={handleAddMeal} onLogout={handleLogout} />
      )}
    </main>
  )
}
