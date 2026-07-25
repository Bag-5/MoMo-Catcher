'use client'

export default function GhanaHeader() {
  return (
    <header className="w-full">
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
        <div className="flex-1 bg-[#006B3F]" />
      </div>
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CE1126] via-[#FCD116] to-[#006B3F] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            MC
          </div>
          <div>
            <h1 className="text-lg font-bold text-black dark:text-white leading-tight">
              MoMo Catcher
            </h1>
            <p className="text-xs text-black/60 dark:text-white/50">
              Scam SMS &bull; Phone Checker &bull; MoMo Ref Scanner
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
