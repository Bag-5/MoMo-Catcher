import { AnalysisResult, InputType } from './types'
import { analyzeSms } from './analyzers/sms'
import { analyzePhone } from './analyzers/phone'
import { analyzeMomoRef } from './analyzers/momo'

function detectInputType(input: string): InputType {
  const trimmed = input.trim()

  const phoneClean = trimmed.replace(/[\s\-\(\)\.\+]/g, '')
  const ghanaPhoneRegex = /^(0|233)(24|25|54|55|59|53|20|50|27|57|26|56)\d{7}$/
  if (ghanaPhoneRegex.test(phoneClean)) {
    return 'phone'
  }

  const refClean = trimmed.replace(/\s/g, '').toUpperCase()
  if (/^[A-Z0-9]{6,20}$/.test(refClean) && !trimmed.includes(' ')) {
    return 'momo_ref'
  }

  return 'sms'
}

export function analyze(input: string): AnalysisResult {
  const type = detectInputType(input)

  switch (type) {
    case 'phone':
      return analyzePhone(input)
    case 'momo_ref':
      return analyzeMomoRef(input)
    case 'sms':
    default:
      return analyzeSms(input)
  }
}
