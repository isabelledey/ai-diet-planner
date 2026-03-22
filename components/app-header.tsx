"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/lib/store";
import { Camera, History, LayoutDashboard } from "lucide-react";

interface AppHeaderProps {
  onLogout?: () => void
  showLogout?: boolean
  onGoBack?: () => void
}

export function AppHeader({ onLogout, showLogout = false, onGoBack }: AppHeaderProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const syncSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (mounted) {
          setIsAuthenticated(Boolean(session) || Boolean(getUserProfile()))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(Boolean(session) || Boolean(getUserProfile()))
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    // FIXED: Frosted glass effect applied here
    <header dir="ltr" className="fixed top-0 left-0 z-50 w-full bg-slate-50/60 backdrop-blur-md border-b border-slate-200/50 transition-all">
      <div className="relative flex h-14 items-center justify-between px-4">
        <h1 className="text-xl font-bold text-slate-900 drop-shadow-sm">NutriSnap</h1>

        {/* FIXED: Added z-[60] so it stays above the dark overlay */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg text-slate-900 focus-visible:outline-none bg-white/50 backdrop-blur-sm shadow-sm"
        >
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${
              isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${
              isOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${
              isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
            }`}
          />
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-14 right-4 z-50 w-64 rounded-xl bg-white p-4 shadow-2xl border border-slate-100">
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/analyze"
                      className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Analyze
                    </Link>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start rounded-xl border-0 px-3 py-2 hover:bg-slate-50"
                      onClick={() => {
                        setIsOpen(false)
                        if (onGoBack) {
                          onGoBack()
                          return
                        }
                        if (window.history.length > 1) {
                          router.back()
                        } else {
                          router.push('/dashboard')
                        }
                      }}
                    >
                      Go Back
                    </Button>

                    {isLoading ? (
                      <div className="h-9 w-full animate-pulse rounded-xl bg-slate-100" />
                    ) : isAuthenticated ? (
                      <Link
                        href="/history"
                        className="flex w-full items-center justify-start rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => {
                          setIsOpen(false)
                        }}
                      >
                        <History className="mr-2 h-4 w-4" />
                        My Progress
                      </Link>
                    ) : null}
                </div>

                {showLogout && onLogout && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start rounded-xl border-0 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setIsOpen(false)
                      onLogout()
                    }}
                  >
                    Log Out
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
