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

  function handleAnalyze(input: string) {
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      const analysis = analyze(input)
      setResult(analysis)
      setLoading(false)
    }, 400)
  }

  function handleClear() {
    setResult(null)
  }

  return (
    <>
      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Check if it&apos;s a scam
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            Paste a suspicious SMS, phone number, or MoMo reference below
          </p>
        </div>

        <InputBox onAnalyze={handleAnalyze} loading={loading} />

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-3 text-black/40 dark:text-white/40">
            <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Analyzing...</span>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4">
            <ResultCard result={result} />
            <button
              onClick={handleClear}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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
