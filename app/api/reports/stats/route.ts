import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

export const runtime = 'nodejs'

export async function GET() {
  if (!DATABASE_URL) {
    return NextResponse.json({ error: 'Reporting is not configured' }, { status: 500 })
  }

  try {
    const sql = neon(DATABASE_URL)
    const rows = await sql`
      SELECT category, COUNT(*)::int AS count
      FROM reports
      GROUP BY category
      ORDER BY count DESC
    `
    const total = rows.reduce((sum, row) => sum + (Number(row.count) || 0), 0)
    const byCategory: Record<string, number> = {}
    for (const row of rows) {
      byCategory[row.category] = Number(row.count) || 0
    }

    return NextResponse.json({ total, byCategory })
  } catch (err) {
    console.error('Report stats error:', err)
    return NextResponse.json({ error: 'Could not load report statistics' }, { status: 500 })
  }
}
