'use client'

import { useState } from 'react'
import GhanaHeader from '@/components/GhanaHeader'
import InputBox from '@/components/InputBox'
import LinkChecker from '@/components/LinkChecker'
import ScreenshotScanner from '@/components/ScreenshotScanner'
import ResultCard from '@/components/ResultCard'
import ReportModal from '@/components/ReportModal'
import { analyze } from '@/lib/analyze'
import { analyzeUrl } from '@/lib/analyzers/url'
import { addScan } from '@/lib/storage'
import { AnalysisResult, CheckMode } from '@/lib/types'

const modes: { id: CheckMode; label: string; icon: string }[] = [
  { id: 'text', label: 'SMS / Phone / MoMo', icon: '💬' },
  { id: 'link', label: 'Check Link', icon: '🔗' },
  { id: 'screenshot', label: 'Scan Screenshot', icon: '📸' },
]

export default function Home() {
  const [mode, setMode] = useState<CheckMode>('text')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showReport, setShowReport] = useState(false)

  function finish(result: AnalysisResult, fallback: boolean) {
    setResult(result)
    setUsedFallback(fallback)
    if (result.inputType !== 'screenshot') {
      addScan({
        type: result.inputType,
        isScam: result.isScam,
        confidence: result.confidence,
        riskLevel: result.riskLevel,
        topDetail: result.details[0] ?? result.reason,
      })
    }
  }

  async function handleText(input: string) {
    setLoading(true)
    setResult(null)
    setUsedFallback(false)
    setErrorMessage('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type: 'text' }),
      })
      if (res.ok) {
        const data = await res.json()
        finish(data.result, data.source === 'fallback')
      } else {
        finish(analyze(input), true)
      }
    } catch {
      finish(analyze(input), true)
    } finally {
      setLoading(false)
    }
  }

  async function handleLink(input: string) {
    setLoading(true)
    setResult(null)
    setUsedFallback(false)
    setErrorMessage('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type: 'link' }),
      })
      if (res.ok) {
        const data = await res.json()
        finish(data.result, data.source === 'fallback')
      } else {
        finish(analyzeUrl(input), true)
      }
    } catch {
      finish(analyzeUrl(input), true)
    } finally {
      setLoading(false)
    }
  }

  async function handleScreenshot(imageBase64: string) {
    setLoading(true)
    setResult(null)
    setUsedFallback(false)
    setErrorMessage('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'screenshot', imageBase64 }),
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data.result)
        setUsedFallback(data.source === 'fallback')
      } else {
        const data = await res.json().catch(() => null)
        setErrorMessage(data?.error ?? 'Could not analyze the screenshot. Please try again.')
      }
    } catch {
      setErrorMessage('Could not reach the analysis service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setResult(null)
    setErrorMessage('')
    setShowReport(false)
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
        <div className="text-center mb-6 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Check if it&apos;s a scam
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            Paste a message, check a link, or scan a screenshot
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5 mb-6 animate-stagger-1">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id)
                handleClear()
              }}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                mode === m.id
                  ? 'bg-white dark:bg-[#0d1117] text-black dark:text-white shadow-md'
                  : 'text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80'
              }`}
            >
              <span className="text-base sm:text-lg leading-none">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'text' && <InputBox onAnalyze={handleText} loading={loading} />}
        {mode === 'link' && <LinkChecker onAnalyze={handleLink} loading={loading} />}
        {mode === 'screenshot' && <ScreenshotScanner onAnalyze={handleScreenshot} loading={loading} />}

        {loading && mode !== 'screenshot' && (
          <div className="mt-8 flex items-center justify-center gap-3 text-black/40 dark:text-white/40 animate-stagger-2">
            <span className="relative inline-flex">
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="absolute inset-0 w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-ping opacity-20" />
            </span>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300 text-center animate-stagger-2">
            {errorMessage}
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
            {result.isScam && (
              <button
                onClick={() => setShowReport(true)}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-stagger-3"
                style={{ background: 'linear-gradient(135deg, #CE1126, #8f0f1f)' }}
              >
                🚨 Report this scam
              </button>
            )}
            <button
              onClick={handleClear}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-stagger-4"
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

      {showReport && result && (
        <ReportModal result={result} onClose={() => setShowReport(false)} />
      )}
    </>
  )
}
