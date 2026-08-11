import { InputType, ScanRecord, ReportRecord } from './types'

const SCANS_KEY = 'momocatcher_scans'
const QUIZ_KEY = 'momocatcher_quiz_best'

function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // storage full or blocked — silently ignore
  }
}

export function addScan(record: Omit<ScanRecord, 'id' | 'timestamp'>): void {
  const scans = getScans()
  scans.unshift({
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  })
  safeSet(SCANS_KEY, JSON.stringify(scans.slice(0, 200)))
}

export function getScans(): ScanRecord[] {
  const raw = safeGet(SCANS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getScanStats() {
  const scans = getScans()
  const scamCount = scans.filter(s => s.isScam).length
  const confidence = scans.length
    ? scans.reduce((sum, s) => sum + s.confidence, 0) / scans.length
    : 0

  const typeCounts: Record<string, number> = {}
  const detailCounts: Record<string, number> = {}
  for (const s of scans) {
    typeCounts[s.type] = (typeCounts[s.type] ?? 0) + 1
    if (s.topDetail) {
      detailCounts[s.topDetail] = (detailCounts[s.topDetail] ?? 0) + 1
    }
  }

  return {
    total: scans.length,
    scamCount,
    scamRate: scans.length ? scamCount / scans.length : 0,
    avgConfidence: confidence,
    typeCounts,
    commonScams: Object.entries(detailCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count })),
  }
}

export function getQuizBest(): number | null {
  const raw = safeGet(QUIZ_KEY)
  if (raw === null) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function setQuizBest(score: number): void {
  const best = getQuizBest()
  if (best === null || score > best) {
    safeSet(QUIZ_KEY, String(score))
  }
}

export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(SCANS_KEY)
    window.localStorage.removeItem(QUIZ_KEY)
  } catch {
    // ignore
  }
}

export function buildReportExcerpt(input: string, max = 120): string {
  const clean = input.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

export type { ReportRecord }
