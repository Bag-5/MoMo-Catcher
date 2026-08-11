export type InputType = 'sms' | 'phone' | 'momo_ref' | 'link' | 'screenshot'
export type RiskLevel = 'low' | 'medium' | 'high'
export type CheckMode = 'text' | 'link' | 'screenshot'

export interface AnalysisResult {
  inputType: InputType
  originalInput: string
  isScam: boolean
  confidence: number
  riskLevel: RiskLevel
  reason: string
  details: string[]
  network?: string
  extractedText?: string
}

export interface ScamPattern {
  pattern: RegExp
  label: string
  weight: number
}

export type ReportCategory =
  | 'Agyapade / Fake Lottery'
  | 'MoMo PIN Phishing'
  | 'SIM Swap Scam'
  | 'Fake Deposit'
  | 'Fake Promo'
  | 'Romance Scam'
  | 'Employment Scam'
  | 'Other'

export interface ScanRecord {
  id: string
  type: InputType
  isScam: boolean
  confidence: number
  riskLevel: RiskLevel
  topDetail: string
  timestamp: number
}

export interface ReportRecord {
  category: ReportCategory
  note?: string
  inputExcerpt: string
  riskLevel: RiskLevel
  timestamp: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface ScamCategory {
  id: string
  name: string
  tagline: string
  description: string
  redFlags: string[]
  howToReport: string
  accent: string
}
