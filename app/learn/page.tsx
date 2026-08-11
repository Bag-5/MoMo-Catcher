import Link from 'next/link'
import GhanaHeader from '@/components/GhanaHeader'

const sections = [
  {
    href: '/learn/categories',
    icon: '🕵️',
    title: 'Scam Categories',
    desc: 'Meet the 8 most common scam tricks targeting Ghanaians — Agyapade, MoMo PIN phishing, SIM swap, and more. Learn the red flags and how to report each one.',
    gradient: 'from-[#CE1126]/10 via-transparent to-[#FCD116]/10',
  },
  {
    href: '/learn/quiz',
    icon: '🧠',
    title: 'Quizzes',
    desc: 'Test yourself with 12 real-world scam scenarios. See how fast you can spot a fraudster — and track your best score.',
    gradient: 'from-[#FCD116]/10 via-transparent to-[#006B3F]/10',
  },
]

export default function LearnPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126]/5 via-[#FCD116]/5 to-[#006B3F]/5 dark:from-[#CE1126]/10 dark:via-[#FCD116]/5 dark:to-[#006B3F]/10 animate-gradient-drift" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#CE1126]/10 dark:bg-[#CE1126]/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-[#006B3F]/10 dark:bg-[#006B3F]/20 blur-3xl animate-float-slow" style={{ animationDelay: '-4s' }} />
      </div>

      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-2 animate-stagger-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Learn to spot scams
          </h2>
          <p className="text-sm sm:text-base text-black/50 dark:text-white/50">
            Knowledge is your first defence — arm yourself
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-2xl border-2 border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] group"
              style={{ animation: `stagger-fade-in 0.4s ease-out ${0.1 + i * 0.1}s both` }}
            >
              <div className={`bg-gradient-to-br ${s.gradient} p-5 sm:p-6`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl group-hover:animate-bounce-subtle inline-block">{s.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-1 flex items-center gap-2">
                      {s.title}
                      <span className="text-xs opacity-60 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
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
