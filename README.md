<div align="center">

# 🛡️ MoMo Catcher

**Ghana Scam SMS Detector** — *spot mobile money fraud before it hurts you.*

A smart web app that analyzes suspicious SMS messages, phone numbers, MoMo transaction references, and links for scam indicators — powered by AI, built for Ghana.

**Accra Technical University · Project ATU 302**

<br>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![OpenRouter](https://img.shields.io/badge/Powered_by_OpenRouter-AAFF00?style=for-the-badge&logo=openrouter&logoColor=black)](https://openrouter.ai)
[![Neon](https://img.shields.io/badge/Postgres-Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-momo--catcher.vercel.app-006B3F?style=for-the-badge)](https://momo-catcher.vercel.app)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-GitHub-262626?style=for-the-badge)](https://github.com/Bag-5/MoMo-Catcher/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🧠 How It Works](#-how-it-works)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📡 API Reference](#-api-reference)
- [🔒 Privacy](#-privacy)
- [📚 References](#-references)

---

## ✨ Features

### 🏠 Home — Three Ways to Check

| Mode | What it does |
|------|-------------|
| 💬 **SMS / Phone / MoMo Ref** | Paste any suspicious message, Ghanaian number (024, 055, 020, 027…), or MoMo reference (`MOMO12ABC345`) → instant risk assessment |
| 🔗 **Check Link** | Analyze URLs for phishing — suspicious TLDs, typosquatted brands (MTN, Vodafone, GCB…), shortened links, scam keywords |
| 📸 **Scan Screenshot** | Snap or upload a screenshot of a scam SMS — vision AI reads the text and analyzes it |

### 📊 Results
- Risk level (**low / medium / high**) with an animated confidence score
- Plain-language reasoning + the exact scam indicators found
- 🚨 **Report Scam** — flag confirmed scams to the community database

### 📚 Learn
- **Scam Categories** — deep dives into Ghana's 8 deadliest tricks: Agyapade fake lottery, MoMo PIN phishing, SIM swap, fake deposits, fake promos, romance scams, employment scams, ghost-salary scams — each with red flags & how to report
- **Quizzes** — 12 real-world scenarios, instant explanations, best-score tracking

### 📈 Dashboard
- **Scam statistics** — total checks, scam rate, average confidence
- **Report statistics** — live community reports by category
- **Common scam types** — top detected indicators, ranked
- 🗑️ **Clear local data** — full privacy control

### 🔒 Privacy
- Plain-language policy: what's stored on-device, what's sent to the AI, how reporting works
- **No accounts. No cookies. No tracking.**

---

## 🧠 How It Works

```
        ┌─────────────────────────────────────────────────────────────┐
        │  User input: SMS · Phone · MoMo ref · Link · Screenshot     │
        └─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌─────────────────────────────────────────────────────────────┐
        │              POST /api/analyze (Next.js route)              │
        │                                                             │
        │   ┌─────────────────────┐      ┌─────────────────────────┐  │
        │   │  OpenRouter AI      │      │  Local fallback engine  │  │
        │   │  · gpt-oss-20b      │◀────▶│  regex analyzers for    │  │
        │   │  · gemma-4-26b      │  ai  │  SMS / phone / momo /   │  │
        │   │    (vision)         │ fail │  URL                    │  │
        │   └─────────────────────┘      └─────────────────────────┘  │
        └─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌─────────────────────────────────────────────────────────────┐
        │              Result: risk, confidence, details              │
        └─────────────────────────────────────────────────────────────┘
                                    │
                            🚨 Report Scam?
                                    │
                                    ▼
        ┌─────────────────────────────────────────────────────────────┐
        │      POST /api/report ──▶ Neon Postgres ──▶ Dashboard       │
        └─────────────────────────────────────────────────────────────┘
```

**🤖 AI Analysis** — [OpenRouter](https://openrouter.ai) free-tier models with automatic failover:

| Purpose | Primary model | Fallbacks |
|---------|--------------|-----------|
| Text (SMS / phone / MoMo / link) | `openai/gpt-oss-20b:free` | `google/gemma-4-31b-it:free` → `nvidia/nemotron-nano-9b-v2:free` |
| Screenshots (vision) | `google/gemma-4-26b-a4b-it:free` | `nvidia/nemotron-nano-12b-v2-vl:free` |

**🗄️ Reports** — stored in [Neon](https://neon.tech) Postgres, aggregated for the Dashboard. **No reporter identity is ever collected.**

**📱 On-device data** — scan summaries & quiz scores live only in `localStorage`. Full message text is never stored anywhere.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/OpenRouter_API-AAFF00?logo=openrouter&logoColor=black" alt="OpenRouter">
  <img src="https://img.shields.io/badge/Neon_Postgres-00E599?logo=neon&logoColor=black" alt="Neon">
  <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" alt="Vercel">
</p>

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 · App Router · Turbopack |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom 3D flag-gradient animations |
| **AI** | OpenRouter API (free-tier LLMs — text & vision) |
| **Database** | Neon Postgres via `@neondatabase/serverless` |
| **Deployment** | Vercel — auto-deploy from `master` |

---

## 📁 Project Structure

```text
momo-catcher/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # AI + fallback analysis (text, link, screenshot)
│   │   ├── report/route.ts         # POST scam reports → Neon
│   │   └── reports/stats/route.ts  # GET report statistics
│   ├── dashboard/page.tsx          # Statistics dashboard
│   ├── learn/
│   │   ├── page.tsx                # Learn hub
│   │   ├── categories/page.tsx     # Scam category guides
│   │   └── quiz/page.tsx           # Interactive quiz
│   ├── privacy/page.tsx            # Privacy policy
│   ├── layout.tsx                  # Root layout + bottom navigation
│   └── page.tsx                    # Home — SMS / link / screenshot check
├── components/
│   ├── BottomNav.tsx               # Mobile bottom tab bar
│   ├── GhanaHeader.tsx             # Flag-themed header
│   ├── InputBox.tsx                # SMS / phone / MoMo input
│   ├── LinkChecker.tsx             # URL input
│   ├── ScreenshotScanner.tsx       # Image upload + camera capture
│   ├── ResultCard.tsx              # Risk result display
│   └── ReportModal.tsx             # Report scam form
└── lib/
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

- [Node.js](https://nodejs.org) 18+
- [OpenRouter](https://openrouter.ai) API key *(free tier works)*
- [Neon](https://neon.tech) Postgres project *(only needed for the Report feature)*

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Bag-5/MoMo-Catcher.git
cd MoMo-Catcher

# 2. Install dependencies
npm install
```

```bash
# 3. Create the environment file (.env.local)
# OpenRouter key — required for AI analysis
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
# Neon connection string — optional, powers the Report feature
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

```bash
# 4. Create the reports table (in your Neon SQL editor)
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  note TEXT,
  input_excerpt TEXT,
  risk_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

```bash
# 5. Run it
npm run dev
```

> 🌐 Open [http://localhost:3000](http://localhost:3000)

> 💡 **No `DATABASE_URL`?** The app still works fully — only the Report feature and Dashboard report stats are disabled.

### Production

```bash
npm run build
npm run start
```

---

## 📡 API Reference

### `POST /api/analyze`

Analyze text, a link, or a screenshot.

```jsonc
// 💬 Text (SMS / phone / MoMo ref)
{ "input": "Congratulations! You won GHS 50,000. Call 0243000000 to claim", "type": "text" }

// 🔗 Link
{ "input": "https://mtn-promo-winners-claim.xyz/verify", "type": "link" }

// 📸 Screenshot (base64 JPEG — resized client-side)
{ "type": "screenshot", "imageBase64": "..." }
```

**Response:**

```jsonc
{
  "source": "ai",              // "ai" or "fallback"
  "result": {
    "inputType": "sms",        // "sms" | "phone" | "momo_ref" | "link" | "screenshot"
    "isScam": true,
    "confidence": 0.95,        // 0 = safe, 1 = definitely a scam
    "riskLevel": "high",       // "low" | "medium" | "high"
    "reason": "Fake lottery scam — you never entered this promo",
    "details": ["Claims a prize you never entered", "Asks you to call a random number"],
    "network": "MTN",          // detected network (optional)
    "extractedText": "..."     // screenshots only (optional)
  }
}
```

### `POST /api/report`

Submit a scam report.

```jsonc
{
  "category": "Agyapade / Fake Lottery",   // one of the 8 categories
  "note": "The caller asked for my MoMo PIN",  // optional
  "inputExcerpt": "Congratulations! You won GHS 50,000…",  // truncated sample
  "riskLevel": "high"
}
```

**Response:** `{ "ok": true, "id": 1 }`

### `GET /api/reports/stats`

**Response:**

```jsonc
{
  "total": 12,
  "byCategory": {
    "Agyapade / Fake Lottery": 5,
    "MoMo PIN Phishing": 4
  }
}
```

---

## 🔒 Privacy

> **The bottom line:** everything you check stays on your device unless you *choose* to report a scam.

| Data | Where it goes |
|------|--------------|
| Scan summaries (type, risk, confidence) | 🖥️ **Your browser** — `localStorage`, cleared anytime |
| Full message text | ❌ **Nowhere** — never stored |
| AI analysis input (text / screenshot) | 🤖 OpenRouter — **single request**, not stored by us |
| Scam reports (category, note, excerpt) | 🗄️ Neon database — **voluntary**, anonymous |

No accounts. No cookies. No tracking. See the [Privacy page](https://momo-catcher.vercel.app/privacy) for the full policy.

---

## 📚 References

- [National Communications Authority (NCA) — scam reporting, shortcode 500](https://nca.org.gh)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Neon — Serverless Postgres](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

<div align="center">

*Built with ❤️ in Accra — for a safer Ghana.*

**Accra Technical University · Project ATU 302**

</div>
