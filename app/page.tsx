'use client'

import { useState } from 'react'
import GhanaHeader from '@/components/GhanaHeader'
import InputBox from '@/components/InputBox'
import ResultCard from '@/components/ResultCard'
import { analyze } from '@/lib/analyze'
import { AnalysisResult } from '@/lib/types'

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  async function handleAnalyze(input: string) {
    setLoading(true)
    setResult(null)
    setUsedFallback(false)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data.result)
        setUsedFallback(data.source === 'fallback')
      } else {
        const fallback = analyze(input)
        setResult(fallback)
        setUsedFallback(true)
      }
    } catch {
      const fallback = analyze(input)
      setResult(fallback)
      setUsedFallback(true)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setResult(null)
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126]/5 via-[#FCD116]/5 to-[#006B3F]/5 dark:from-[#CE1126]/10 dark:via-[#FCD116]/5 dark:to-[#006B3F]/10 animate-gradient-drift" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#CE1126]/10 dark:bg-[#CE1126]/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-[#FCD116]/10 dark:bg-[#FCD116]/20 blur-3xl animate-float-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-[#006B3F]/10 dark:bg-[#006B3F]/20 blur-3xl animate-float-slow" style={{ animationDelay: '-6s' }} />
      </div>

      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Check if it&apos;s a scam
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            Paste a suspicious SMS, phone number, or MoMo reference below
          </p>
        </div>

        <InputBox onAnalyze={handleAnalyze} loading={loading} />

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-3 text-black/40 dark:text-white/40 animate-stagger-2">
            <span className="relative inline-flex">
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="absolute inset-0 w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-ping opacity-20" />
            </span>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4">
            {usedFallback && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5 text-xs text-amber-700 dark:text-amber-300 text-center animate-stagger-2">
                ⚡ AI analysis unavailable — used local fallback engine
              </div>
            )}
            <ResultCard result={result} />
            <button
              onClick={handleClear}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-stagger-5"
            >
              Check another
            </button>
          </div>
        )}

        <footer className="mt-16 pb-8 text-center">
          <p className="text-xs text-black/30 dark:text-white/20">
            Accra Technical University &bull; Project ATU 302
          </p>
        </footer>
      </main>
    </>
  )
}
