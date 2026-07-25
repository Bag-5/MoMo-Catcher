'use client'

import { AnalysisResult } from '@/lib/types'
import TiltCard from './TiltCard'
import { useEffect, useState } from 'react'

interface ResultCardProps {
  result: AnalysisResult
}

const riskColors = {
  low: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
    icon: '🟢',
    label: 'Low Risk',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
    icon: '🟡',
    label: 'Medium Risk',
  },
  high: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    icon: '🔴',
    label: 'High Risk',
  },
}

const inputTypeLabels = {
  sms: 'SMS Message',
  phone: 'Phone Number',
  momo_ref: 'MoMo Reference',
}

export default function ResultCard({ result }: ResultCardProps) {
  const colors = riskColors[result.riskLevel]
  const confidencePct = Math.round(result.confidence * 100)
  const [animWidth, setAnimWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(confidencePct), 100)
    return () => clearTimeout(t)
  }, [confidencePct])

  return (
    <TiltCard tiltDegree={6} glare={true} className="animate-stagger-2">
      <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl animate-bounce-subtle">{colors.icon}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                {colors.label}
              </span>
            </div>
            <span className="text-xs text-black/50 dark:text-white/40 bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full">
              {inputTypeLabels[result.inputType]}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-medium text-black/60 dark:text-white/60">
                Scam Confidence
              </span>
              <span className="text-2xl font-bold text-black dark:text-white tabular-nums">
                {animWidth}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  result.riskLevel === 'high'
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : result.riskLevel === 'medium'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                }`}
                style={{ width: `${animWidth}%` }}
              />
            </div>
          </div>

          <div className="animate-stagger-3">
            <p className="font-semibold text-black dark:text-white mb-1">{result.reason}</p>
            {result.network && (
              <p className="text-sm text-black/50 dark:text-white/50">
                Network: <span className="font-medium">{result.network}</span>
              </p>
            )}
          </div>

          {result.details.length > 0 && (
            <div className="space-y-1.5 animate-stagger-4">
              {result.details.map((detail, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  style={{
                    animation: `stagger-fade-in 0.4s ease-out ${0.1 + i * 0.08}s both`,
                  }}
                >
                  <span className="mt-0.5 text-xs shrink-0">◆</span>
                  {detail}
                </div>
              ))}
            </div>
          )}

          {result.isScam && (
            <div
              className="bg-red-100/70 dark:bg-red-950/50 rounded-xl p-4 border border-red-200 dark:border-red-800 animate-stagger-5"
              style={{
                animation: `stagger-fade-in 0.5s ease-out 0.5s both`,
              }}
            >
              <p className="font-semibold text-sm text-red-800 dark:text-red-200 mb-1 flex items-center gap-2">
                <span className="inline-block animate-shake">⚠️</span>
                Safety Tip
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Never share your MoMo PIN, OTP, or personal details with anyone. 
                Banks and mobile networks never ask for these via SMS. 
                Report suspicious messages to your network provider immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </TiltCard>
  )
}
