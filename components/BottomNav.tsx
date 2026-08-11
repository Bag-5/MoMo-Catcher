'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Learn', icon: '📚' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/privacy', label: 'Privacy', icon: '🔒' },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-xl mx-auto px-4 pb-3">
        <div className="rounded-2xl bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/40 px-2 py-1.5 flex items-center justify-around">
          {tabs.map(tab => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-[#006B3F] dark:text-[#7ee2a8]'
                    : 'text-black/50 dark:text-white/40 hover:text-black/80 dark:hover:text-white/70 active:scale-95'
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#CE1126]/10 via-[#FCD116]/15 to-[#006B3F]/10" />
                )}
                <span className="relative text-lg leading-none">{tab.icon}</span>
                <span className={`relative text-[10px] font-semibold ${active ? '' : 'opacity-80'}`}>
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-gradient-to-r from-[#CE1126] via-[#FCD116] to-[#006B3F]" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
