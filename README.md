# 🛡️ MoMo Catcher

**Ghana Scam SMS Detector** — a web app that helps Ghanaians spot mobile money fraud before it hurts them. Check suspicious SMS messages, phone numbers, MoMo transaction references, and links for scam indicators, scan screenshots of scam texts, learn how fraudsters operate, and report scams to help the community.

Built as a final-year project at **Accra Technical University (Project ATU 302)**.

🌍 **Live:** [https://momo-catcher.vercel.app](https://momo-catcher.vercel.app)

---

## ✨ Features

### Home
- **SMS / Phone / MoMo Ref Check** — paste any suspicious message, Ghanaian phone number (024/025/054/055/059/053, 020/050, 027/057/026/056…), or MoMo reference (e.g. `MOMO12ABC345`) and get an instant risk assessment.
- **Check Link** — analyze URLs for phishing: suspicious TLDs, typosquatted brand domains (MTN, Vodafone, AT, GCB…), shortened-link abuse, and scam keywords.
- **Scan Screenshot** — take a photo or upload a screenshot of a scam SMS; a vision AI extracts the text and analyzes it for fraud.

### Results
- Risk level (low / medium / high), scam confidence score, plain-language reasoning, and a list of the specific scam indicators found.
- **Report Scam** — flag confirmed scams. Reports are stored in the project database and power the community Dashboard.

### Learn
- **Scam Categories** — in-depth guides to the 8 most common Ghanaian scam tricks: Agyapade/fake lottery, MoMo PIN phishing, SIM swap, fake deposits, fake promos, romance scams, employment scams, and ghost-salary scams — each with red flags and how to report.
- **Quizzes** — 12 real-world scenarios to test your scam radar, with explanations and best-score tracking.

### Dashboard
- **Scam statistics** — total checks, scam rate, and average confidence from your on-device scan history.
- **Report statistics** — live community reports by category.
- **Common scam types** — the top indicators detected, ranked.
- **Clear local data** — wipe scan history and quiz scores anytime.

### Privacy
- A plain-language policy covering exactly what is stored (on-device summaries only), what is sent to the AI service for single-use analysis, and how reporting works. No accounts, no cookies, no tracking.

---

## 🧠 How it works

```
User input (SMS / phone / MoMo ref / link / screenshot)
        │
        ▼
┌──────────────────────┐   OpenRouter (AI)    ┌──────────────────────┐
│  POST /api/analyze   │ ───────────────────▶ │  LLM analysis        │
│  (Next.js route)     │ ◀─────────────────── │  gpt-oss-20b (text)  │
└──────────────────────┘   JSON result        │  gemma-4-26b (vision)│
        │                                      └──────────────────────┘
        │ fallback if AI unavailable
        ▼
┌──────────────────────┐
│  Local heuristic     │  regex-based analyzers for SMS, phone,
│  fallback engine     │  MoMo refs, and URLs (lib/analyzers/)
└──────────────────────┘
        │
        ▼
┌──────────────────────┐   Neon Postgres      ┌──────────────────────┐
│  POST /api/report    │ ───────────────────▶ │  reports table       │
│  GET  /api/reports/  │                      │  (community stats)   │
│       stats          │                      └──────────────────────┘
└──────────────────────┘
```

**AI analysis** uses [OpenRouter](https://openrouter.ai) free-tier models:
- Text (SMS / phone / MoMo / link): `openai/gpt-oss-20b:free`, with automatic fallback to `google/gemma-4-31b-it:free` and `nvidia/nemotron-nano-9b-v2:free` when rate-limited.
- Screenshots (vision): `google/gemma-4-26b-a4b-it:free`, fallback `nvidia/nemotron-nano-12b-v2-vl:free`.

**Reports** are stored in a [Neon](https://neon.tech) Postgres database (`reports` table) and aggregated for the Dashboard. No reporter identity is collected.

**On-device data** — scan summaries (type, risk, confidence, top indicator) and quiz best scores live only in the browser's `localStorage`. Full message text is never stored.

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|-----------|
| Framework  | Next.js 16 (App Router, TypeScript, Turbopack) |
| Styling    | Tailwind CSS with custom 3D/flag-gradient animations |
| AI         | OpenRouter API (free-tier LLMs, text + vision) |
| Database   | Neon Postgres (`@neondatabase/serverless`) |
| Deploy     | Vercel (auto-deploy from `master`) |

---

## 📁 Project Structure

```
app/
├── api/
│   ├── analyze/route.ts        # AI + fallback analysis (text, link, screenshot)
│   ├── report/route.ts         # POST scam reports → Neon
│   └── reports/stats/route.ts  # GET report statistics
├── dashboard/page.tsx          # Statistics dashboard
├── learn/
│   ├── page.tsx                # Learn hub
│   ├── categories/page.tsx     # Scam category guides
│   └── quiz/page.tsx           # Interactive quiz
├── privacy/page.tsx            # Privacy policy
├── layout.tsx                  # Root layout + bottom navigation
└── page.tsx                    # Home (check SMS / link / screenshot)
components/
├── BottomNav.tsx               # Mobile bottom tab bar
├── GhanaHeader.tsx             # Flag-themed header
├── InputBox.tsx                # SMS / phone / MoMo input
├── LinkChecker.tsx             # URL input
├── ScreenshotScanner.tsx       # Image upload + camera capture
├── ResultCard.tsx              # Risk result display
└── ReportModal.tsx             # Report scam form
lib/
├── analyze.ts                  # Local fallback dispatcher
├── analyzers/                  # Regex engines: sms, phone, momo, url
├── scamCategories.ts           # Learn content data
├── quizzes.ts                  # Quiz question data
├── storage.ts                  # localStorage helpers
└── types.ts                    # Shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key (free tier works)
- A [Neon](https://neon.tech) Postgres project (optional — only needed for the Report feature)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/Bag-5/MoMo-Catcher.git
cd MoMo-Catcher
npm install

# 2. Create the environment file
# .env.local
OPENROUTER_API_KEY=sk-or-v1-...
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require

# 3. Create the reports table (if using Neon)
# Run in your Neon SQL editor:
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  note TEXT,
  input_excerpt TEXT,
  risk_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

# 4. Run it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Without `DATABASE_URL`, the app still works fully except the Report feature and Dashboard report stats.

### Build & production

```bash
npm run build
npm run start
```

---

## 📡 API Reference

### `POST /api/analyze`
Analyze text, a link, or a screenshot.

```jsonc
// Text (SMS / phone / MoMo ref / link)
{ "input": "Congratulations! You won GHS 50,000. Call 0243000000 to claim", "type": "text" }

// Link
{ "input": "https://mtn-promo-winners-claim.xyz/verify", "type": "link" }

// Screenshot (base64, JPEG — resized client-side)
{ "type": "screenshot", "imageBase64": "..." }
```

**Response:** `{ "source": "ai" | "fallback", "result": { inputType, isScam, confidence, riskLevel, reason, details[], network?, extractedText? } }`

### `POST /api/report`
Submit a scam report.

```jsonc
{
  "category": "Agyapade / Fake Lottery",   // one of the 8 categories
  "note": "optional note",
  "inputExcerpt": "truncated sample of the scam message",
  "riskLevel": "high"
}
```

**Response:** `{ "ok": true, "id": 1 }`

### `GET /api/reports/stats`
**Response:** `{ "total": 12, "byCategory": { "Agyapade / Fake Lottery": 5, ... } }`

---

## 🔒 Privacy Summary

- **On-device:** scan summaries + quiz scores in browser `localStorage`; full message text is never stored.
- **AI analysis:** your input (text or screenshot) is sent to OpenRouter for a single analysis request and is not stored by us.
- **Reporting:** voluntary — sends category, optional note, and a short excerpt to the project database. No personal identity is collected.
- **No accounts, cookies, or tracking.**

Full details on the [Privacy page](https://momo-catcher.vercel.app/privacy).

---

## 📚 References

- [National Communications Authority (NCA) — scam reporting (shortcode 500)](https://nca.org.gh)
- [OpenRouter API docs](https://openrouter.ai/docs)
- [Neon — serverless Postgres](https://neon.tech/docs)

---

*Accra Technical University • Project ATU 302*
