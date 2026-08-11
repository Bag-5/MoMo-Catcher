import Link from 'next/link'
import GhanaHeader from '@/components/GhanaHeader'
import { scamCategories } from '@/lib/scamCategories'

export default function CategoriesPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126]/5 via-[#FCD116]/5 to-[#006B3F]/5 dark:from-[#CE1126]/10 dark:via-[#FCD116]/5 dark:to-[#006B3F]/10 animate-gradient-drift" />
      </div>

      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 transition-colors mb-4 animate-stagger-1">
          ← Back to Learn
        </Link>

        <div className="text-center mb-8 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Scam categories
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            The tricks scammers use on Ghanaians — and how to fight back
          </p>
        </div>

        <div className="space-y-5">
          {scamCategories.map((cat, i) => (
            <div
              key={cat.id}
              className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm overflow-hidden"
              style={{ animation: `stagger-fade-in 0.4s ease-out ${0.08 * i}s both` }}
            >
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }} />
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">{cat.name}</h3>
                  <p className="text-sm italic text-black/50 dark:text-white/50 mt-1">{cat.tagline}</p>
                </div>

                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{cat.description}</p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#CE1126] dark:text-[#ff7a89] mb-2">
                    🚩 Red flags
                  </p>
                  <ul className="space-y-1.5">
                    {cat.redFlags.map(flag => (
                      <li key={flag} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
                        <span className="mt-0.5 text-xs shrink-0 text-[#CE1126] dark:text-[#ff7a89]">◆</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#006B3F]/5 dark:bg-[#006B3F]/15 rounded-xl p-3 border border-[#006B3F]/10 dark:border-[#006B3F]/30">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#006B3F] dark:text-[#7ee2a8] mb-1">
                    📢 How to report
                  </p>
                  <p className="text-sm text-black/70 dark:text-white/70">{cat.howToReport}</p>
                </div>
              </div>
            </div>
          ))}
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
