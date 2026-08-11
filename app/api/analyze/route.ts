import { NextRequest, NextResponse } from 'next/server'
import { analyze } from '@/lib/analyze'
import { analyzeUrl } from '@/lib/analyzers/url'
import { AnalysisResult, CheckMode } from '@/lib/types'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const TEXT_MODELS = [
  'openai/gpt-oss-20b:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-nano-9b-v2:free',
]
const VISION_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
]
const MAX_IMAGE_BYTES = 4_500_000

const TEXT_PROMPT = `You are a Ghanaian mobile money fraud analyst. Your job is to analyze SMS messages, phone numbers, MoMo transaction references, and links for scam indicators.

Analyze the input and return ONLY a JSON object with these fields:
{
  "inputType": "sms" | "phone" | "momo_ref" | "link",
  "isScam": boolean,
  "confidence": number between 0 and 1 (0 = definitely safe, 1 = definitely a scam),
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

Links: check for shortened URLs, suspicious TLDs, typosquatted brand domains (mtn, vodafone, airteltigo, gcb, ecobank), phishing keywords (login, verify, claim, prize), and http vs https.

Be thorough but fair. Legitimate transaction SMS from banks or networks should score low.`

const SCREENSHOT_PROMPT = `You are a Ghanaian mobile money fraud analyst. Extract ALL visible text from the screenshot in this image, then analyze it for scam indicators (Agyapade fake lottery, MoMo PIN phishing, fake deposits, SIM swap tricks, fake promos, romance scams).

Return ONLY a JSON object with these fields:
{
  "inputType": "screenshot",
  "isScam": boolean,
  "confidence": number between 0 and 1 (0 = definitely safe, 1 = definitely a scam),
  "riskLevel": "low" | "medium" | "high",
  "reason": short explanation,
  "details": array of specific scam indicators found,
  "network": detected Ghanaian network or null,
  "extractedText": the full text you extracted from the screenshot
}

If the screenshot contains no readable text, set isScam to false, confidence to 0, riskLevel to "low", and explain in the reason that no text was found.`

function tryParseJson(text: string): Partial<AnalysisResult> | null {
  const trimmed = text.trim()
  const braceStart = trimmed.indexOf('{')
  const braceEnd = trimmed.lastIndexOf('}')
  if (braceStart !== -1 && braceEnd > braceStart) {
    const candidate = trimmed.slice(braceStart, braceEnd + 1)
    try {
      return JSON.parse(candidate) as Partial<AnalysisResult>
    } catch {
      const fixed = candidate
        .replace(/(["'])?\b(\w+)\b(["'])?\s*:/g, '"$2": ')
        .replace(/:\s*'([^']+)'/g, ':"$1"')
        .replace(/,\s*([}\]])/g, '$1')
      try {
        return JSON.parse(fixed) as Partial<AnalysisResult>
      } catch {
        return null
      }
    }
  }
  return null
}

function validateResult(result: Partial<AnalysisResult>, input: string): AnalysisResult {
  return {
    inputType: result.inputType ?? 'sms',
    originalInput: input,
    isScam: result.isScam ?? false,
    confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0,
    riskLevel: (result.riskLevel === 'low' || result.riskLevel === 'medium' || result.riskLevel === 'high') ? result.riskLevel : 'low',
    reason: result.reason ?? 'Analysis complete',
    details: Array.isArray(result.details) ? result.details : [],
    network: result.network ?? undefined,
    extractedText: typeof result.extractedText === 'string' ? result.extractedText : undefined,
  }
}

async function callOpenRouter(
  input: string,
  type: 'text' | 'screenshot',
  imageBase64?: string,
): Promise<AnalysisResult | null> {
  if (!OPENROUTER_API_KEY) return null

  const models = type === 'screenshot' ? VISION_MODELS : TEXT_MODELS
  const messages =
    type === 'screenshot'
      ? [
          { role: 'system', content: SCREENSHOT_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
              { type: 'text', text: 'Analyze this screenshot for scams.' },
            ],
          },
        ]
      : [
          { role: 'system', content: TEXT_PROMPT },
          { role: 'user', content: `Analyze this for scams:\n\n"""${input}"""` },
        ]

  for (const model of models) {
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
          model,
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 1000,
        }),
        signal: AbortSignal.timeout(60000),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown')
        console.error(`OpenRouter ${res.status} (${model}): ${errText.slice(0, 300)}`)
        continue
      }

      const data = await res.json()
      const content = data?.choices?.[0]?.message?.content
      if (!content) continue

      const parsed = tryParseJson(content)
      if (!parsed) {
        console.error(`Failed to parse JSON from ${model}:`, content.slice(0, 200))
        continue
      }

      return validateResult(parsed, input)
    } catch (err) {
      console.error(`OpenRouter error (${model}):`, err)
      continue
    }
  }

  return null
}

function localFallback(input: string, type: CheckMode): AnalysisResult {
  if (type === 'link') return analyzeUrl(input)
  return analyze(input)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { input?: string; type?: CheckMode; imageBase64?: string }
  const type: CheckMode = body.type === 'link' || body.type === 'screenshot' ? body.type : 'text'
  const trimmed = (body.input ?? '').trim()

  if (type === 'screenshot') {
    if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
    if (body.imageBase64.length > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image too large' }, { status: 413 })
    }

    const aiResult = await callOpenRouter('', 'screenshot', body.imageBase64)
    if (aiResult) {
      return NextResponse.json({ source: 'ai', result: aiResult })
    }
    return NextResponse.json(
      {
        source: 'error',
        error: 'Screenshot analysis is unavailable right now. Please try again in a moment.',
      },
      { status: 503 },
    )
  }

  if (!trimmed) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 })
  }

  const aiResult = await callOpenRouter(trimmed, 'text')
  if (aiResult) {
    return NextResponse.json({ source: 'ai', result: aiResult })
  }

  const fallback = localFallback(trimmed, type)
  return NextResponse.json({ source: 'fallback', result: fallback })
}
