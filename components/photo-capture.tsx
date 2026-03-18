'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Camera, Upload, X, ArrowLeft, Loader2, Sun, Target, Utensils } from 'lucide-react'
import { toast } from 'sonner'
import type { MealAnalysis, ScanResult } from '@/lib/types'

interface PhotoCaptureProps {
  onMealAnalyzed: (analysis: MealAnalysis, imageDataUrl: string) => void
  onBack: () => void
  initialImageDataUrl?: string | null
}

const OTHER_OPTION = '__other__'

export function PhotoCapture({ onMealAnalyzed, onBack, initialImageDataUrl = null }: PhotoCaptureProps) {
  const [realBase64String, setRealBase64String] = useState<string | null>(initialImageDataUrl)
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRealBase64String(initialImageDataUrl)
    setScanResult(null)
    setAnswers({})
    setCustomAnswers({})
  }, [initialImageDataUrl])

  const toDataUrl = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
          return
        }
        reject(new Error('Failed to read image as base64.'))
      }
      reader.onerror = () => reject(new Error('Failed to read selected file.'))
      reader.readAsDataURL(file)
    })
  }, [])

  const resetQuestionState = useCallback(() => {
    setScanResult(null)
    setAnswers({})
    setCustomAnswers({})
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      try {
        const imageDataUrl = await toDataUrl(file)
        setRealBase64String(imageDataUrl)
        resetQuestionState()
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    },
    [toDataUrl, resetQuestionState],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearPreview = () => {
    if (isScanning || isCalculating) return
    setRealBase64String(null)
    resetQuestionState()
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleScanMeal = useCallback(async () => {
    if (!realBase64String) return

    setIsScanning(true)
    resetQuestionState()

    try {
      console.log('First 50 chars of image:', realBase64String.substring(0, 50))
      const res = await fetch('/api/analyze/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: realBase64String }),
      })
      const data = await res.json()

      if (!data.success) {
        toast.error(data.message || 'Failed to analyze your meal. Please try again.')
        return
      }

      const result = data.result as ScanResult
      setScanResult(result)

      if (!result.is_food) {
        toast.error('This image does not look like food. Please upload a meal photo.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }, [realBase64String, resetQuestionState])

  const selectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (value !== OTHER_OPTION) {
      setCustomAnswers((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  const setCustomAnswer = (questionId: string, value: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const allQuestionsAnswered = (() => {
    if (!scanResult?.questions?.length) return true

    return scanResult.questions.every((question) => {
      const answer = answers[question.id]
      if (!answer) return false
      if (answer !== OTHER_OPTION) return true
      return Boolean(customAnswers[question.id]?.trim())
    })
  })()

  const formatClarifications = () => {
    if (!scanResult?.questions?.length) {
      return 'No clarifications provided by user.'
    }

    return scanResult.questions
      .map((question) => {
        const selected = answers[question.id]
        if (selected === OTHER_OPTION) {
          const typed = customAnswers[question.id]?.trim() || 'No custom answer provided'
          return `Q: ${question.text} A: ${typed} (User typed).`
        }
        return `Q: ${question.text} A: ${selected}.`
      })
      .join(' ')
  }

  const handleCalculateMacros = useCallback(async () => {
    if (!realBase64String || !scanResult?.is_food || !allQuestionsAnswered) return

    setIsCalculating(true)

    try {
      const clarifications = formatClarifications()
      console.log('First 50 chars of image:', realBase64String.substring(0, 50))
      const res = await fetch('/api/analyze/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: realBase64String, clarifications }),
      })
      const data = await res.json()

      if (data.success) {
        onMealAnalyzed(data.analysis as MealAnalysis, realBase64String)
      } else {
        toast.error(data.message || 'Failed to analyze your meal. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }, [allQuestionsAnswered, onMealAnalyzed, realBase64String, scanResult?.is_food])

  const busy = isScanning || isCalculating

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4 pb-2">
          <button 
            onClick={onBack}
            disabled={busy}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="flex-1 pr-10 text-center text-lg font-bold leading-tight tracking-tight text-slate-900">
            Log Your Meal
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          
          {!realBase64String ? (
            <>
              {/* Upload Area (Empty State) */}
              <div className="flex flex-col p-6">
                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`group relative flex flex-col items-center gap-6 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all ${
                    isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <Camera className="h-10 w-10" />
                  </div>
                  <div className="flex max-w-[480px] flex-col items-center gap-2">
                    <p className="text-xl font-bold leading-tight tracking-tight text-slate-900">Snap or Upload</p>
                    <p className="text-sm font-normal leading-relaxed text-slate-600">
                      Place your meal in the center of the frame for the best AI analysis results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <div className="flex w-full max-w-[480px] flex-col items-stretch gap-3 px-6 py-2">
                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex h-14 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 text-base font-bold leading-normal tracking-wide text-white transition-transform active:scale-[0.98]"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="truncate">Open Camera</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-14 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-100 px-5 text-base font-bold leading-normal tracking-wide text-slate-900 transition-transform active:scale-[0.98]"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="truncate">Choose File</span>
                  </button>
                </div>
              </div>

              {/* Tips Section */}
              <div className="px-6 py-8">
                <h3 className="mb-4 text-lg font-bold leading-tight tracking-tight text-slate-900">Quick Tips for Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Good Lighting</p>
                      <p className="text-sm text-slate-600">Avoid shadows by using natural or overhead light.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Stay Focused</p>
                      <p className="text-sm text-slate-600">Keep the camera still until the photo is sharp.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Show Portions</p>
                      <p className="text-sm text-slate-600">Ensure the whole plate is visible to estimate size.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Image Preview State */}
              <div className="flex flex-col items-center p-6">
                <div className="relative w-full max-w-sm">
                  <div className="overflow-hidden rounded-3xl border-2 border-slate-100 shadow-lg">
                    <img src={realBase64String} alt="Food photo preview" className="aspect-square w-full object-cover" />
                  </div>
                  {!busy && (
                    <button
                      onClick={clearPreview}
                      className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:scale-110"
                      aria-label="Remove photo"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Action Buttons */}
              <div className="px-6 pb-6">
                {!scanResult && (
                  <button
                    onClick={handleScanMeal}
                    disabled={busy}
                    className="flex h-14 w-full items-center justify-center rounded-xl bg-emerald-500 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform active:scale-[0.98] disabled:opacity-70"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing your meal...
                      </>
                    ) : (
                      'Analyze Calories'
                    )}
                  </button>
                )}
              </div>

              {/* Clarification Questions UI */}
              {scanResult?.is_food && (
                <div className="mx-6 mb-8 space-y-5 rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm font-bold text-slate-900">Answer these quick questions to improve accuracy</p>
                  {scanResult.questions.map((question) => {
                    const selected = answers[question.id]
                    const options = [...question.options, 'Other']
                    return (
                      <div key={question.id} className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">{question.text}</p>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => {
                            const value = option === 'Other' ? OTHER_OPTION : option
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => selectAnswer(question.id, value)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                                  selected === value
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                        {selected === OTHER_OPTION && (
                          <Input
                            value={customAnswers[question.id] || ''}
                            onChange={(e) => setCustomAnswer(question.id, e.target.value)}
                            placeholder="Type your answer..."
                            className="h-12 rounded-xl border-slate-200 bg-white"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {scanResult?.is_food && (
                <div className="px-6 pb-6">
                  <button
                    onClick={handleCalculateMacros}
                    disabled={isCalculating || !allQuestionsAnswered}
                    className="flex h-14 w-full items-center justify-center rounded-xl bg-emerald-500 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform active:scale-[0.98] disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Calculating macros...
                      </>
                    ) : (
                      'Calculate Macros'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Take a photo"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload an image"
      />
    </div>
  )
}
