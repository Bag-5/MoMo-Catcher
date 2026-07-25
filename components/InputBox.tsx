'use client'

import { useState, useRef } from 'react'

interface InputBoxProps {
  onAnalyze: (input: string) => void
  loading: boolean
}

const examples = [
  'Paste an SMS, phone number, or MoMo ref...',
  'e.g. "Congratulations! You won GHS 5,000. Call 024XXXXXXX to claim"',
  'e.g. "024XXXXXXX"',
  'e.g. "MOMO12ABC345"',
]

export default function InputBox({ onAnalyze, loading }: InputBoxProps) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    const trimmed = input.trim()
    if (trimmed && !loading) {
      onAnalyze(trimmed)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isEmpty = !input.trim()

  return (
    <div className="w-full space-y-3 animate-stagger-1">
      <div
        className={`group relative rounded-2xl border-2 transition-all duration-300 ${
          focused
            ? 'border-[#FCD116] shadow-[0_0_30px_-5px_rgba(252,209,22,0.4)] dark:shadow-[0_0_30px_-5px_rgba(252,209,22,0.2)]'
            : 'border-black/10 dark:border-white/10'
        } bg-white/80 dark:bg-white/5 backdrop-blur-sm`}
        style={{
          transform: focused ? 'perspective(800px) rotateX(-3deg) translateZ(10px)' : 'perspective(800px) rotateX(0deg)',
          transition: 'transform 0.3s ease-out, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#CE1126]/5 via-transparent to-[#006B3F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={examples[0]}
          rows={4}
          className="relative w-full resize-none bg-transparent px-5 pt-5 pb-3 text-base text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none rounded-2xl"
        />
        <div className="relative px-5 pb-3 flex flex-wrap gap-1.5">
          {[
            { label: 'SMS', tip: 'Paste a suspicious message' },
            { label: 'Phone', tip: '024XXXXXXX' },
            { label: 'MoMo Ref', tip: 'MOMO12ABC' },
          ].map(({ label, tip }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setInput(tip)
                textareaRef.current?.focus()
              }}
              className="px-3 py-1 text-xs font-medium rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
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
                transformStyle: 'preserve-3d',
              }
        }
      >
        <div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
            transform: 'translateZ(5px)',
          }}
        />
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="relative">Analyzing...</span>
          </>
        ) : (
          <>
            <span className="relative">🔍</span>
            <span className="relative">Analyze</span>
          </>
        )}
        {!isEmpty && !loading && (
          <span className="absolute inset-0 rounded-xl ring-2 ring-white/20 ring-offset-2 ring-offset-transparent animate-pulse-ring" />
        )}
      </button>

      <p className="text-xs text-center text-black/40 dark:text-white/30 animate-stagger-2">
        All analysis happens on your device. Nothing is stored or sent anywhere.
      </p>
    </div>
  )
}
