import { NextRequest, NextResponse } from 'next/server'
import { analyze } from '@/lib/analyze'
import { AnalysisResult } from '@/lib/types'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const MODEL = 'openai/gpt-oss-20b:free'

const SYSTEM_PROMPT = `You are a Ghanaian mobile money fraud analyst. Your job is to analyze SMS messages, phone numbers, and MoMo transaction references for scam indicators.

Analyze the input and return ONLY a JSON object with these fields:
{
  "inputType": "sms" | "phone" | "momo_ref",
  "isScam": boolean,
  "confidence": number between 0 and 1,
  "riskLevel": "low" | "medium" | "high",
  "reason": short explanation,
  "details": array of specific scam indicators found,
  "network": detected Ghanaian network or null
}

Ghana-specific scam patterns to watch for:
- Fake lottery (Agyapade, betting, "you won")
- MoMo PIN phishing ("verify your MoMo account")
- Fake deposits ("GHS X,XXX deposited to your MoMo")
- SIM swap scams
- "Momo for you" transfer reversal tricks
- Fake COVID/food grants
- Employment scams targeting graduates
- Fake MTN/Vodafone/AT/AirtelTigo promos
- Ghost teacher/worker salary scams
- Romance scams with Ghanaian angle

Phone numbers: validate against Ghana format (+233 or 0 followed by 24,25,54,55,59,53,20,50,27,57,26,56 then 7 digits). Identify the network (MTN: 024/025/054/055/059/053, Vodafone: 020/050, AT: 027/057/026/056).

MoMo refs: typical format is MOMO + alphanumeric, 8-20 chars.

Be thorough but fair. Legitimate transaction SMS from banks or networks should score low.`

async function callOpenRouter(input: string): Promise<AnalysisResult | null> {
  if (!OPENROUTER_API_KEY) return null

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://momo-catcher.vercel.app',
        'X-Title': 'MoMo Catcher',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this for scams:\n\n"${input}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 200,
      }),
      signal: AbortSignal.timeout(45000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'unknown')
      console.error(`OpenRouter ${res.status}: ${errText}`)
      return null
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content) as Partial<AnalysisResult>

    return {
      inputType: parsed.inputType ?? 'sms',
      originalInput: input,
      isScam: parsed.isScam ?? false,
      confidence: typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0,
      riskLevel: (parsed.riskLevel === 'low' || parsed.riskLevel === 'medium' || parsed.riskLevel === 'high') ? parsed.riskLevel : 'low',
      reason: parsed.reason ?? 'Analysis complete',
      details: Array.isArray(parsed.details) ? parsed.details : [],
      network: parsed.network ?? undefined,
    }
  } catch (err) {
    console.error('OpenRouter error:', err)
    return null
  }
}

export async function POST(req: NextRequest) {
  const { input } = await req.json() as { input?: string }
  if (!input || typeof input !== 'string' || !input.trim()) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 })
  }

  const trimmed = input.trim()
  const aiResult = await callOpenRouter(trimmed)

  if (aiResult) {
    return NextResponse.json({ source: 'ai', result: aiResult })
  }

  const fallback = analyze(trimmed)
  return NextResponse.json({ source: 'fallback', result: fallback })
}
