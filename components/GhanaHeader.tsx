'use client'

export default function GhanaHeader() {
  return (
    <header className="w-full">
      <div className="h-1.5 w-full flex overflow-hidden">
        <div className="flex-1 bg-[#CE1126] animate-flag-wave" style={{ animationDelay: '0s' }} />
        <div className="flex-1 bg-[#FCD116] animate-flag-wave" style={{ animationDelay: '0.1s' }} />
        <div className="flex-1 bg-[#006B3F] animate-flag-wave" style={{ animationDelay: '0.2s' }} />
      </div>
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CE1126] via-[#FCD116] to-[#006B3F] flex items-center justify-center text-white font-bold text-lg shadow-lg animate-logo-spin perspective-3d" style={{ transformStyle: 'preserve-3d' }}>
            <span className="animate-logo-float" style={{ transformStyle: 'preserve-3d' }}>MC</span>
          </div>
          <div className="animate-slide-in">
            <h1 className="text-lg font-bold text-black dark:text-white leading-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_10%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
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
