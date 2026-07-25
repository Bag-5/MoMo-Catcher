import { AnalysisResult, ScamPattern } from '../types'

const momoFormatPattern = /^[A-Z0-9]{8,20}$/i

const scamRefPatterns: ScamPattern[] = [
  { pattern: /^(0+|[A]+|[9]+)$/i, label: 'Suspicious repetitive characters', weight: 0.5 },
  { pattern: /(WIN|PRIZE|BONUS|CLAIM)/i, label: 'Prize-related reference', weight: 0.35 },
  { pattern: /^(123|000|111|222)/, label: 'Sequential prefix', weight: 0.3 },
  { pattern: /[AEIOU]{4,}/i, label: 'Unnatural vowel cluster', weight: 0.2 },
]

const ghanaMoMoRefPrefixes = [
  'MOMO', 'MTN', 'VOD', 'TIG', 'AT', 'MOC', 'PAY'
]

export function analyzeMomoRef(ref: string): AnalysisResult {
  const trimmed = ref.trim()
  const details: string[] = []

  const hasValidFormat = momoFormatPattern.test(trimmed) || /^\d{8,15}$/.test(trimmed)

  if (!hasValidFormat) {
    details.push('Does not match typical MoMo reference format')
  }

  const matchedPrefix = ghanaMoMoRefPrefixes.find(p =>
    trimmed.toUpperCase().startsWith(p)
  )
  if (matchedPrefix) {
    details.push(`Matches ${matchedPrefix} reference format`)
  }

  const detected: { label: string; weight: number }[] = []
  for (const sp of scamRefPatterns) {
    if (sp.pattern.test(trimmed)) {
      detected.push({ label: sp.label, weight: sp.weight })
    }
  }

  const totalScore = detected.reduce((s, d) => s + d.weight, 0)

  if (detected.length > 0) {
    details.push(...detected.map(d => d.label))
  }

  const isScam = totalScore >= 0.3
  const confidence = Math.min(totalScore + 0.1, 0.95)

  return {
    inputType: 'momo_ref',
    originalInput: ref,
    isScam,
    confidence: Math.round(confidence * 100) / 100,
    riskLevel: isScam ? 'high' : totalScore >= 0.15 ? 'medium' : 'low',
    reason: isScam
      ? 'Reference contains scam-like patterns'
      : 'Reference looks clean',
    details,
  }
}
