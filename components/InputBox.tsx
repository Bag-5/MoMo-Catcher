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
    <div className="w-full space-y-3">
      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 ${
          focused
            ? 'border-[#FCD116] shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30'
            : 'border-black/10 dark:border-white/10'
        } bg-white dark:bg-white/5`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={examples[0]}
          rows={4}
          className="w-full resize-none bg-transparent px-5 pt-5 pb-3 text-base text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none rounded-2xl"
        />
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
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
              className="px-3 py-1 text-xs font-medium rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isEmpty || loading}
        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
          isEmpty || loading
            ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#CE1126] via-[#FCD116] to-[#006B3F] text-white shadow-md hover:shadow-lg active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <span>🔍</span>
            Analyze
          </>
        )}
      </button>

      <p className="text-xs text-center text-black/40 dark:text-white/30">
        All analysis happens on your device. Nothing is stored or sent anywhere.
      </p>
    </div>
  )
}
