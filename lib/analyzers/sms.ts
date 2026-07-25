import { AnalysisResult, ScamPattern } from '../types'

const scamPatterns: ScamPattern[] = [
  { pattern: /you['']?ve\s*won/i, label: 'Claims you won a prize', weight: 0.25 },
  { pattern: /claim\s*(your|this)\s*(prize|reward|gift)/i, label: 'Prize claim request', weight: 0.2 },
  { pattern: /congratulations.*(won|selected|chosen)/i, label: 'Fake congratulations', weight: 0.2 },
  { pattern: /verify\s*(your|this)\s*(account|pin|password|details)/i, label: 'Account verification request', weight: 0.3 },
  { pattern: /(pin|password|otp|secret).*(send|share|provide|give)/i, label: 'Requests sensitive info', weight: 0.35 },
  { pattern: /(mtn|vodafone|airteltigo|at).*\b(free|bonus|promo)\b/i, label: 'Fake network promo', weight: 0.15 },
  { pattern: /(gh[¢]?|ghs)\s*[0-9,]+\s*(free|bonus|reward)/i, label: 'Money reward promise', weight: 0.2 },
  { pattern: /click.*(link|here|http|www\.)/i, label: 'Suspicious link', weight: 0.25 },
  { pattern: /(http|https|bit\.ly|tinyurl|shorturl)/i, label: 'Contains shortened URL', weight: 0.15 },
  { pattern: /(urgent|immediately|limited|expires?\s*soon)/i, label: 'Urgency pressure tactic', weight: 0.2 },
  { pattern: /(mtn|vodafone|airteltigo|at).*(ghana|gh)/i, label: 'Spoofs Ghanaian network', weight: 0.1 },
  { pattern: /(call|text|send).*(\d{5,})/i, label: 'Asks to call/text a number', weight: 0.15 },
  { pattern: /won.*(iphone|phone|cash|money|prize|car|laptop)/i, label: 'Fake lottery winnings', weight: 0.25 },
  { pattern: /(dear|customer|valued).*(update|confirm|reactivate)/i, label: 'Impersonation of service', weight: 0.2 },
  { pattern: /(bank|ecobank|access|stanbic|gcb|calbank).*((lock|suspend|close|block))/i, label: 'Bank account scare', weight: 0.3 },
  { pattern: /(mo[m]?o|mobile\s*money).*((deposit|credit|receive).*[0-9])/i, label: 'MoMo deposit notification', weight: -0.15 },
  { pattern: /from.*(mtn|vodafone|airteltigo).*(:?\s*\d)/i, label: 'Legit network SMS format', weight: -0.1 },
]

const ghanaianNetworkKeywords = [
  'mtn', 'vodafone', 'airteltigo', 'at', 'ghana',
  'momoplus', 'me2u', 'momo'
]

export function analyzeSms(text: string): AnalysisResult {
  const detected: { label: string; weight: number }[] = []

  for (const sp of scamPatterns) {
    if (sp.pattern.test(text)) {
      detected.push({ label: sp.label, weight: sp.weight })
    }
  }

  const totalScore = detected.reduce((sum, d) => sum + d.weight, 0)

  const matchedNetwork = ghanaianNetworkKeywords.find(kw =>
    new RegExp(kw, 'i').test(text)
  )

  let confidence: number
  let isScam: boolean
  let riskLevel: 'low' | 'medium' | 'high'
  let reason: string

  if (totalScore >= 0.5) {
    confidence = Math.min(totalScore, 0.99)
    isScam = true
    riskLevel = totalScore >= 0.8 ? 'high' : 'medium'
    reason = `${detected.length} scam indicator${detected.length > 1 ? 's' : ''} detected`
  } else if (totalScore >= 0.2) {
    confidence = totalScore
    isScam = totalScore >= 0.35
    riskLevel = 'medium'
    reason = 'Some suspicious patterns found'
  } else {
    confidence = Math.max(0, 1 - totalScore * 3)
    isScam = false
    riskLevel = 'low'
    reason = 'No significant scam indicators'
  }

  return {
    inputType: 'sms',
    originalInput: text,
    isScam,
    confidence: Math.round(confidence * 100) / 100,
    riskLevel,
    reason,
    details: detected.map(d => d.label),
    network: matchedNetwork ?? undefined,
  }
}
