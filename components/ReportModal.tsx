'use client'

import { useState } from 'react'
import { AnalysisResult, ReportCategory } from '@/lib/types'
import { buildReportExcerpt } from '@/lib/storage'

interface ReportModalProps {
  result: AnalysisResult
  onClose: () => void
}

const categories: ReportCategory[] = [
  'Agyapade / Fake Lottery',
  'MoMo PIN Phishing',
  'SIM Swap Scam',
  'Fake Deposit',
  'Fake Promo',
  'Romance Scam',
  'Employment Scam',
  'Other',
]

export default function ReportModal({ result, onClose }: ReportModalProps) {
  const [category, setCategory] = useState<ReportCategory>('Agyapade / Fake Lottery')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          note,
          inputExcerpt: buildReportExcerpt(result.originalInput),
          riskLevel: result.riskLevel,
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setDone(true)
    } catch {
      setError('Could not send the report. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#0d1117] rounded-t-3xl sm:rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl p-5 max-h-[85vh] overflow-y-auto">
        {done ? (
          <div className="text-center py-8 space-y-4">
            <span className="text-5xl inline-block animate-bounce-subtle">✅</span>
            <h3 className="text-lg font-bold text-black dark:text-white">Report sent</h3>
            <p className="text-sm text-black/60 dark:text-white/60">
              Thank you for helping fight scams in Ghana. Your report is stored in our project database and
              counted on the Dashboard.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #CE1126, #006B3F)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white">🚨 Report this scam</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-xs text-black/60 dark:text-white/60 max-h-20 overflow-y-auto">
              &ldquo;{result.originalInput.length > 160 ? `${result.originalInput.slice(0, 160)}…` : result.originalInput}&rdquo;
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Scam category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                      category === c
                        ? 'bg-[#CE1126] text-white shadow-md scale-105'
                        : 'bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Note <span className="text-black/40 dark:text-white/40 font-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. The caller said they were from MTN and asked for my PIN"
                rows={3}
                maxLength={500}
                className="w-full resize-none bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#FCD116]/60"
              />
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #CE1126, #FCD116, #006B3F)' }}
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending report...
                </>
              ) : (
                'Submit Report'
              )}
            </button>

            <p className="text-[11px] text-center text-black/40 dark:text-white/30">
              Your report (category, note, and a short excerpt) is saved to our project database — no personal
              identity is collected. See Privacy for details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
