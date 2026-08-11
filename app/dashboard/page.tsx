'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import GhanaHeader from '@/components/GhanaHeader'
import { getScanStats, clearAllLocalData } from '@/lib/storage'

interface ReportStats {
  total: number
  byCategory: Record<string, number>
}

export default function DashboardPage() {
  const [scans, setScans] = useState(() => getScanStats())
  const [reports, setReports] = useState<ReportStats | null>(null)
  const [reportsLoading, setReportsLoading] = useState(true)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    fetch('/api/reports/stats')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && typeof data.total === 'number') {
          setReports({ total: data.total, byCategory: data.byCategory ?? {} })
        }
      })
      .catch(() => null)
      .finally(() => setReportsLoading(false))
  }, [])

  const maxReportCount = reports
    ? Math.max(1, ...Object.values(reports.byCategory))
    : 1

  const scamPct = Math.round(scans.scamRate * 100)
  const confPct = Math.round(scans.avgConfidence * 100)

  function handleClear() {
    clearAllLocalData()
    setScans(getScanStats())
    setCleared(true)
    setTimeout(() => setCleared(false), 2500)
  }

  const statCards = [
    { label: 'Scans checked', value: String(scans.total), icon: '🔍', accent: 'from-[#CE1126]/10 to-transparent' },
    { label: 'Flagged as scam', value: `${scamPct}%`, icon: '🚨', accent: 'from-[#FCD116]/15 to-transparent' },
    { label: 'Avg confidence', value: `${confPct}%`, icon: '🎯', accent: 'from-[#006B3F]/10 to-transparent' },
  ]

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126]/5 via-[#FCD116]/5 to-[#006B3F]/5 dark:from-[#CE1126]/10 dark:via-[#FCD116]/5 dark:to-[#006B3F]/10 animate-gradient-drift" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#FCD116]/10 dark:bg-[#FCD116]/20 blur-3xl animate-float-slow" />
      </div>

      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            Scam statistics from your checks and community reports
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className={`rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-b ${card.accent} bg-white/80 dark:bg-white/5 backdrop-blur-sm p-3 text-center`}
              style={{ animation: `stagger-fade-in 0.4s ease-out ${0.08 * i}s both` }}
            >
              <span className="text-xl block mb-1">{card.icon}</span>
              <p className="text-xl sm:text-2xl font-bold text-black dark:text-white tabular-nums leading-none">
                {card.value}
              </p>
              <p className="text-[10px] sm:text-xs text-black/50 dark:text-white/50 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <section
            className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5"
            style={{ animation: 'stagger-fade-in 0.4s ease-out 0.25s both' }}
          >
            <h3 className="font-bold text-black dark:text-white mb-3 flex items-center gap-2">
              <span className="text-lg">🚨</span> Common scam types detected
            </h3>
            {scans.commonScams.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-black/50 dark:text-white/50">No scans yet.</p>
                <Link href="/" className="text-sm font-semibold text-[#006B3F] dark:text-[#7ee2a8] hover:underline">
                  Check your first message →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scans.commonScams.map((scam, i) => {
                  const pct = Math.round((scam.count / scans.scamCount) * 100)
                  return (
                    <div key={scam.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-black/70 dark:text-white/70 truncate mr-2">{scam.label}</span>
                        <span className="text-black/50 dark:text-white/50 tabular-nums shrink-0">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? 'linear-gradient(90deg, #CE1126, #FCD116)' : '#FCD116',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section
            className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5"
            style={{ animation: 'stagger-fade-in 0.4s ease-out 0.35s both' }}
          >
            <h3 className="font-bold text-black dark:text-white mb-3 flex items-center gap-2">
              <span className="text-lg">📢</span> Report statistics
            </h3>

            {reportsLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-black/50 dark:text-white/50">
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading reports...
              </div>
            ) : reports && reports.total > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-black/60 dark:text-white/60">
                  <span className="font-bold text-lg text-[#CE1126] dark:text-[#ff7a89] tabular-nums">{reports.total}</span>{' '}
                  {'scam'}{reports.total === 1 ? '' : 's'} reported by the community
                </p>
                {Object.entries(reports.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => {
                    const pct = Math.round((count / reports.total) * 100)
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-black/70 dark:text-white/70 truncate mr-2">{category}</span>
                          <span className="text-black/50 dark:text-white/50 tabular-nums shrink-0">{count}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${(count / maxReportCount) * 100}%`,
                              background: 'linear-gradient(90deg, #006B3F, #FCD116)',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-black/50 dark:text-white/50">
                  No reports yet — be the first to fight back.
                </p>
                <Link href="/" className="text-sm font-semibold text-[#CE1126] dark:text-[#ff7a89] hover:underline">
                  Check a message and report a scam →
                </Link>
              </div>
            )}
          </section>

          <section
            className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5"
            style={{ animation: 'stagger-fade-in 0.4s ease-out 0.45s both' }}
          >
            <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
              <span className="text-lg">🗑️</span> Your local data
            </h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Scan history and quiz scores are stored only on this device. Clearing removes them permanently —
              reports already submitted to the server cannot be removed.
            </p>
            <button
              onClick={handleClear}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] border-2 ${
                cleared
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/60'
              }`}
            >
              {cleared ? '✓ Local data cleared' : 'Clear local data'}
            </button>
          </section>
        </div>

        <footer className="mt-16 pb-4 text-center">
          <p className="text-xs text-black/30 dark:text-white/20">
            Accra Technical University &bull; Project ATU 302
          </p>
        </footer>
      </main>
    </>
  )
}
