import { AnalysisResult } from '../types'

interface GhanaNetwork {
  name: string
  prefixes: string[]
}

const networks: GhanaNetwork[] = [
  { name: 'MTN', prefixes: ['024', '025', '054', '055', '059', '053'] },
  { name: 'Vodafone', prefixes: ['020', '050'] },
  { name: 'AT', prefixes: ['027', '057', '026', '056'] },
  { name: 'AirtelTigo', prefixes: ['027', '057'] },
]

const knownScamNumberPatterns = [
  /(\d)\1{4,}/,
  /^(233|0)(5[6-9]|2[6-9])\s*0{2,}/,
]

function cleanNumber(input: string): string {
  return input.replace(/[\s\-\(\)\.\+]/g, '')
}

function detectNetwork(number: string): string | undefined {
  for (const net of networks) {
    for (const prefix of net.prefixes) {
      if (number.startsWith(prefix) || number.startsWith(`233${prefix.slice(1)}`)) {
        return net.name
      }
    }
  }
  return undefined
}

function isValidGhanaNumber(number: string): boolean {
  const cleaned = number.startsWith('233')
    ? `0${number.slice(3)}`
    : number

  const ghanaRegex = /^0(24|25|54|55|59|53|20|50|27|57|26|56)\d{7}$/
  return ghanaRegex.test(cleaned)
}

export function analyzePhone(input: string): AnalysisResult {
  const cleaned = cleanNumber(input)
  const network = detectNetwork(cleaned)
  const valid = isValidGhanaNumber(cleaned)

  const details: string[] = []

  if (network) {
    details.push(`Detected network: ${network}`)
  } else {
    details.push('Could not identify Ghanaian network')
  }

  if (!valid) {
    details.push('Number does not match Ghanaian mobile format')
  }

  const hasKnownScamPattern = knownScamNumberPatterns.some(p => p.test(cleaned))
  if (hasKnownScamPattern) {
    details.push('Number matches known scammer patterns (repeating digits)')
  }

  const isSuspicious = !valid || hasKnownScamPattern
  const isScam = hasKnownScamPattern && !valid

  return {
    inputType: 'phone',
    originalInput: input,
    isScam,
    confidence: isScam ? 0.75 : isSuspicious ? 0.4 : 0.05,
    riskLevel: isScam ? 'high' : isSuspicious ? 'medium' : 'low',
    reason: isScam
      ? 'This number matches scam indicators'
      : isSuspicious
        ? 'Number looks unusual — proceed with caution'
        : 'Number appears legitimate',
    details,
    network,
  }
}
