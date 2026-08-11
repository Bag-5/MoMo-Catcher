'use client'

import { useState } from 'react'

interface LinkCheckerProps {
  onAnalyze: (input: string) => void
  loading: boolean
}

export default function LinkChecker({ onAnalyze, loading }: LinkCheckerProps) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit() {
    const trimmed = input.trim()
    if (trimmed && !loading) {
      onAnalyze(trimmed)
    }
  }

  const isEmpty = !input.trim()

  return (
    <div className="w-full space-y-3 animate-stagger-1">
      <div
        className={`rounded-2xl border-2 transition-all duration-300 ${
          focused
            ? 'border-[#FCD116] shadow-[0_0_30px_-5px_rgba(252,209,22,0.4)] dark:shadow-[0_0_30px_-5px_rgba(252,209,22,0.2)]'
            : 'border-black/10 dark:border-white/10'
        } bg-white/80 dark:bg-white/5 backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2 px-4 pt-3">
          <span className="text-sm text-black/40 dark:text-white/40">🔗</span>
          <span className="text-xs font-medium text-black/40 dark:text-white/40">URL</span>
        </div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="Paste a suspicious link, e.g. https://mtn-promo-win.xyz/claim"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full bg-transparent px-4 pb-4 text-base text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none rounded-2xl"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isEmpty || loading}
        className={`relative w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
          isEmpty || loading
            ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed'
            : 'text-white shadow-lg hover:shadow-xl active:scale-[0.97]'
        }`}
        style={
          isEmpty || loading
            ? {}
            : {
                background: 'linear-gradient(135deg, #CE1126, #FCD116, #006B3F)',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease infinite',
              }
        }
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="relative">Checking link...</span>
          </>
        ) : (
          <>
            <span className="relative">🔍</span>
            <span className="relative">Check Link</span>
          </>
        )}
      </button>

      <p className="text-xs text-center text-black/40 dark:text-white/30">
        Tip: hover over short links like bit.ly before tapping — preview the real destination.
      </p>
    </div>
  )
}
