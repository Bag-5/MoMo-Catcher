'use client'

import Link from 'next/link'
import { useState } from 'react'
import GhanaHeader from '@/components/GhanaHeader'
import { quizQuestions } from '@/lib/quizzes'
import { getQuizBest, setQuizBest } from '@/lib/storage'

type Phase = 'question' | 'feedback' | 'done'

export default function QuizPage() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState<number | null>(() => getQuizBest())

  const question = quizQuestions[index]
  const total = quizQuestions.length

  function handleSelect(optionIndex: number) {
    if (phase !== 'question') return
    setSelected(optionIndex)
    if (optionIndex === question.answerIndex) {
      setScore(prev => prev + 1)
    }
    setPhase('feedback')
  }

  function handleNext() {
    if (index + 1 >= total) {
      setQuizBest(score)
      setBest(getQuizBest())
      setPhase('done')
    } else {
      setIndex(prev => prev + 1)
      setSelected(null)
      setPhase('question')
    }
  }

  function handleRestart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setPhase('question')
  }

  if (phase === 'done') {
    const pct = Math.round((score / total) * 100)
    const verdict =
      pct >= 90
        ? 'Scam slayer! Fraudsters should fear you. 🦸'
        : pct >= 70
          ? 'Solid work — you know your stuff. Keep sharpening. 👍'
          : pct >= 50
            ? 'Getting there. Review the Scam Categories page and try again. 📖'
            : 'Watch out! Read the Scam Categories carefully and come back. 🚨'

    return (
      <>
        <GhanaHeader />
        <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center space-y-5 animate-stagger-1">
            <span className="text-6xl inline-block animate-bounce-subtle">
              {pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '🧐'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Quiz complete!</h2>
            <p className="text-lg text-black/60 dark:text-white/60">
              You scored <span className="font-bold text-[#006B3F] dark:text-[#7ee2a8]">{score}/{total}</span> ({pct}%)
            </p>
            {best !== null && (
              <p className="text-sm text-black/50 dark:text-white/50">🏅 Best score: {best}/{total}</p>
            )}
            <p className="text-base text-black/70 dark:text-white/70">{verdict}</p>

            <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #CE1126, #FCD116, #006B3F)',
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #CE1126, #006B3F)' }}
              >
                🔁 Try again
              </button>
              <Link
                href="/learn"
                className="flex-1 py-3 rounded-xl font-semibold text-center text-black/60 dark:text-white/60 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 active:scale-[0.97]"
              >
                ← Back to Learn
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <GhanaHeader />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 animate-stagger-1">
          <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 transition-colors">
            ← Learn
          </Link>
          <span className="text-sm font-semibold text-black/60 dark:text-white/60">
            Question {index + 1}/{total}
          </span>
          <span className="text-sm text-black/50 dark:text-white/50">
            ✅ {score}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-6 animate-stagger-1">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((index + (phase === 'feedback' ? 1 : 0)) / total) * 100}%`,
              background: 'linear-gradient(90deg, #CE1126, #FCD116, #006B3F)',
            }}
          />
        </div>

        <div className="rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-5 space-y-4 animate-stagger-2">
          <p className="font-semibold text-black dark:text-white text-base leading-relaxed">
            {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((option, i) => {
              let style = 'bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20'
              if (phase === 'feedback') {
                if (i === question.answerIndex) {
                  style = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200'
                } else if (i === selected) {
                  style = 'bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-900 dark:text-red-200'
                } else {
                  style = 'bg-black/5 dark:bg-white/10 text-black/40 dark:text-white/40'
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={phase === 'feedback'}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 border-transparent ${style} ${
                    phase === 'question' ? 'hover:scale-[1.01] active:scale-[0.98]' : 'cursor-default'
                  }`}
                >
                  <span className="inline-block w-6 text-black/40 dark:text-white/40 font-mono">{String.fromCharCode(65 + i)}.</span>
                  {option}
                  {phase === 'feedback' && i === question.answerIndex && <span className="ml-2">✓</span>}
                  {phase === 'feedback' && i === selected && i !== question.answerIndex && <span className="ml-2">✗</span>}
                </button>
              )
            })}
          </div>

          {phase === 'feedback' && (
            <div
              className={`rounded-xl p-4 border ${
                selected === question.answerIndex
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
              } animate-stagger-3`}
            >
              <p className="text-sm font-semibold mb-1 text-black/80 dark:text-white/80">
                {selected === question.answerIndex ? '🎉 Correct!' : '📝 Not quite.'}
              </p>
              <p className="text-sm text-black/60 dark:text-white/60">{question.explanation}</p>
            </div>
          )}

          {phase === 'feedback' && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.97] animate-stagger-4"
              style={{ background: 'linear-gradient(135deg, #CE1126, #FCD116, #006B3F)' }}
            >
              {index + 1 >= total ? 'See results 🏁' : 'Next question →'}
            </button>
          )}
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
