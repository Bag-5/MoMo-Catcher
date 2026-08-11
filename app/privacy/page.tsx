import Link from 'next/link'
import GhanaHeader from '@/components/GhanaHeader'

const sections = [
  {
    icon: '📱',
    title: 'On-device storage',
    body: 'Scan history and quiz scores are stored in your own browser (localStorage) on this device only. We never receive your scan summaries — only summary data (message type, risk level, confidence, and the top indicator) is saved locally, never the full text of what you checked.',
  },
  {
    icon: '🤖',
    title: 'AI analysis (text & links)',
    body: 'When you check an SMS, phone number, MoMo reference, or link, the text is sent to OpenRouter, a third-party AI service, for one analysis request. It is used only for that single check, is not stored by us, and is never saved to our database. If the AI service is unavailable, analysis runs locally on your device instead.',
  },
  {
    icon: '📸',
    title: 'Screenshot scanning',
    body: 'When you scan a screenshot, the image is sent to the AI service for a single analysis to extract and evaluate the text. The image is used only for that one request, is not stored by us, and never reaches our database.',
  },
  {
    icon: '📢',
    title: 'Reporting scams',
    body: 'When you choose to report a scam, the category, your optional note, the risk level, and a short excerpt (max ~120 characters) of the suspicious message are sent to our project database, hosted on Neon. This is a deliberate, voluntary action — nothing is reported without you pressing "Submit Report". The database stores no personal identity: no name, no email, no phone number of the reporter. These reports appear as statistics on the Dashboard. Reports already submitted cannot be deleted.',
  },
  {
    icon: '🍪',
    title: 'No accounts, cookies, or tracking',
    body: 'There is no login, no user accounts, no analytics, and no advertising trackers. We do not use cookies to follow you around the web, and the app never contacts anything other than our own API, the AI analysis service, and the report database.',
  },
  {
    icon: '🗑️',
    title: 'Your control',
    body: 'You can clear all locally stored data (scan history and quiz scores) anytime from the Dashboard using the "Clear local data" button, or by clearing your browser\'s site data. Clearing the browser also removes everything stored on your device. Server-side reports cannot be removed once submitted.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126]/5 via-[#FCD116]/5 to-[#006B3F]/5 dark:from-[#CE1126]/10 dark:via-[#FCD116]/5 dark:to-[#006B3F]/10 animate-gradient-drift" />
      </div>

      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Privacy
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            How your data is handled — in plain language
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5"
              style={{ animation: `stagger-fade-in 0.4s ease-out ${0.08 * i}s both` }}
            >
              <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                <span className="text-lg">{s.icon}</span> {s.title}
              </h3>
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{s.body}</p>
            </div>
          ))}

          <div
            className="rounded-2xl border-2 border-[#006B3F]/20 dark:border-[#006B3F]/40 bg-[#006B3F]/5 dark:bg-[#006B3F]/15 p-5"
            style={{ animation: 'stagger-fade-in 0.4s ease-out 0.5s both' }}
          >
            <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span> The bottom line
            </h3>
            <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
              Everything you check stays on your device unless you <em>choose</em> to report a scam. AI analysis
              uses your input for a single request and never stores it. Reporting is always voluntary, sends no
              personal identity, and only shares a short excerpt of the scam message to fight fraud in Ghana.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #CE1126, #006B3F)' }}
            >
              ← Back to checking
            </Link>
          </div>
        </div>

        <footer className="mt-16 pb-4 text-center">
          <p className="text-xs text-black/30 dark:text-white/20">
            Accra Technical University &bull; Project ATU 302
          </p>
        </footer>
      </main>
    </>
  )
}
