export type InputType = 'sms' | 'phone' | 'momo_ref'
export type RiskLevel = 'low' | 'medium' | 'high'

export interface AnalysisResult {
  inputType: InputType
  originalInput: string
  isScam: boolean
  confidence: number
  riskLevel: RiskLevel
  reason: string
  details: string[]
  network?: string
}

export interface ScamPattern {
  pattern: RegExp
  label: string
  weight: number
}
