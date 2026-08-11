import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { ReportCategory, RiskLevel } from '@/lib/types'

const DATABASE_URL = process.env.DATABASE_URL

export const runtime = 'nodejs'

const VALID_CATEGORIES: ReportCategory[] = [
  'Agyapade / Fake Lottery',
  'MoMo PIN Phishing',
  'SIM Swap Scam',
  'Fake Deposit',
  'Fake Promo',
  'Romance Scam',
  'Employment Scam',
  'Other',
]

export async function POST(req: NextRequest) {
  if (!DATABASE_URL) {
    return NextResponse.json({ error: 'Reporting is not configured' }, { status: 500 })
  }

  const body = await req.json() as { category?: string; note?: string; inputExcerpt?: string; riskLevel?: string }
  const category = body.category as ReportCategory
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : ''
  const inputExcerpt = typeof body.inputExcerpt === 'string' ? body.inputExcerpt.slice(0, 300) : ''
  const riskLevel: RiskLevel =
    body.riskLevel === 'high' || body.riskLevel === 'medium' || body.riskLevel === 'low'
      ? body.riskLevel
      : 'high'

  try {
    const sql = neon(DATABASE_URL)
    const rows = await sql`
      INSERT INTO reports (category, note, input_excerpt, risk_level)
      VALUES (${category}, ${note || null}, ${inputExcerpt || null}, ${riskLevel})
      RETURNING id
    `
    const id = rows[0]?.id
    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error('Report insert error:', err)
    return NextResponse.json({ error: 'Could not save report' }, { status: 500 })
  }
}
