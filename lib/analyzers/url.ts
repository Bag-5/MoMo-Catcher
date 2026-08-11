import { AnalysisResult } from '../types'

const BRANDS = ['mtn', 'vodafone', 'airteltigo', 'airtel', 'tigo', 'gcb', 'ecobank', 'calbank', 'stanbic', 'absa', 'gtbank', 'firstbank', 'ghipss', 'momo', 'telecel']
const SHORTENERS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'cutt.ly', 'is.gd', 'tiny.cc', 'rb.gy', 's.id', 'shorturl.at', 'snip.ly', 'ow.ly', 'buff.ly']
const SUSPICIOUS_TLDS = ['top', 'xyz', 'click', 'gq', 'tk', 'ml', 'cf', 'ga', 'zip', 'mov', 'icu', 'club', 'online', 'site', 'shop', 'rest', 'cyou']
const SCAM_WORDS = ['login', 'verify', 'claim', 'prize', 'jackpot', 'win', 'winner', 'promo', 'bonus', 'gift', 'reward', 'update', 'unlock', 'free', 'secure', 'account', 'withdraw', 'bank', 'otp', 'pin', 'agyapade']

function normalizeHost(host: string): string {
  return host.replace(/^www\./, '')
}

function typosquatSimilarity(name: string, brand: string): boolean {
  const brandLen = brand.length
  const nameLen = name.length
  if (Math.abs(nameLen - brandLen) > 2) return false
  let edits = 0
  const max = Math.max(nameLen, brandLen)
  for (let i = 0; i < max; i++) {
    if (name[i] !== brand[i]) edits++
  }
  return edits <= 2 && (name.includes(brand) || brand.includes(name) || edits <= 1)
}

function isTyposquat(host: string): string | null {
  const main = normalizeHost(host).split('.')[0]
  const allSegments = normalizeHost(host).split('.')
  for (const seg of allSegments) {
    for (const brand of BRANDS) {
      if (seg === brand) return null
      if (typosquatSimilarity(seg, brand)) return `${seg} ~ ${brand}`
    }
  }
  return null
}

export function analyzeUrl(input: string): AnalysisResult {
  const trimmed = input.trim()
  let url: URL | null = null
  try {
    url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
  } catch {
    return {
      inputType: 'link',
      originalInput: trimmed,
      isScam: false,
      confidence: 0.3,
      riskLevel: 'low',
      reason: 'Could not parse this as a valid URL.',
      details: ['Input is not a recognizable web address.'],
    }
  }

  const details: string[] = []
  let score = 0
  const host = normalizeHost(url.hostname)

  if (url.protocol !== 'https:') {
    score += 20
    details.push('Uses insecure http:// instead of https://')
  }

  if (url.hostname.match(/^\d{1,3}(\.\d{1,3}){3}$/)) {
    score += 30
    details.push('Domain is a raw IP address, often used to hide identity')
  }

  if (host.startsWith('xn--')) {
    score += 40
    details.push('Uses punycode (xn--) encoding to disguise the real domain')
  }

  for (const s of SHORTENERS) {
    if (host === s) {
      score += 15
      details.push(`Shortened link service (${s}) hides the real destination`)
      break
    }
  }

  const tld = host.split('.').pop() ?? ''
  if (SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
    score += 25
    details.push(`Suspicious top-level domain (.${tld}) rarely used by legitimate Ghanaian businesses`)
  }

  const typo = isTyposquat(host)
  if (typo) {
    score += 45
    details.push(`Domain looks like a misspelled brand: "${typo}"`)
  }

  if (url.port && url.port !== '443' && url.port !== '80') {
    score += 15
    details.push(`Uses non-standard port ${url.port}`)
  }

  const combined = `${url.hostname} ${url.pathname} ${url.search}`.toLowerCase()
  const wordHits = SCAM_WORDS.filter(w => combined.includes(w))
  if (wordHits.length > 0) {
    score += Math.min(30, wordHits.length * 10)
    details.push(`Contains scam-like keywords: ${wordHits.join(', ')}`)
  }

  if (host.split('.').length > 3) {
    score += 15
    details.push('Many subdomains, a common phishing trick')
  }

  score = Math.min(95, score)
  const isScam = score >= 50
  const riskLevel = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low'
  const confidence = Math.round((score / 100) * 10) / 10

  return {
    inputType: 'link',
    originalInput: trimmed,
    isScam,
    confidence,
    riskLevel,
    reason: isScam
      ? `Found ${details.length} suspicious sign${details.length === 1 ? '' : 's'} in this link.`
      : 'No strong scam indicators found in this link.',
    details: details.length > 0 ? details : ['Domain looks legitimate at first glance'],
  }
}
