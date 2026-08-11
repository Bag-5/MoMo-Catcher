'use client'

import { useRef, useState } from 'react'

interface ScreenshotScannerProps {
  onAnalyze: (imageBase64: string) => void
  loading: boolean
}

const MAX_DIMENSION = 1400
const JPEG_QUALITY = 0.8

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Not a valid image'))
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas not supported'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY).split(',')[1])
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function ScreenshotScanner({ onAnalyze, loading }: ScreenshotScannerProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined | null) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (screenshot or photo).')
      return
    }
    setError('')
    setFileName(file.name)
    try {
      const base64 = await resizeImage(file)
      setPreview(`data:image/jpeg;base64,${base64}`)
      onAnalyze(base64)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process image')
      setPreview(null)
      setFileName('')
    }
  }

  return (
    <div className="w-full space-y-3 animate-stagger-1">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !loading && fileRef.current?.click()}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!loading) fileRef.current?.click()
          }
        }}
        onDragOver={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          if (!loading) handleFile(e.dataTransfer.files?.[0])
        }}
        className={`rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
          dragging
            ? 'border-[#FCD116] bg-[#FCD116]/10 scale-[1.01]'
            : 'border-black/15 dark:border-white/15 hover:border-[#FCD116]/60 bg-white/80 dark:bg-white/5 backdrop-blur-sm'
        } ${loading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />

        {preview ? (
          <div className="p-3">
            <img src={preview} alt="Screenshot preview" className="w-full max-h-72 object-contain rounded-xl" />
            <p className="text-center text-xs text-black/50 dark:text-white/50 mt-2 truncate">{fileName}</p>
          </div>
        ) : (
          <div className="py-10 px-6 flex flex-col items-center gap-3 text-center">
            <span className={`text-4xl ${dragging ? 'animate-bounce-subtle' : ''}`}>📸</span>
            <p className="text-sm font-medium text-black/70 dark:text-white/70">
              {dragging ? 'Drop it here!' : 'Scan a screenshot of a suspicious SMS'}
            </p>
            <p className="text-xs text-black/40 dark:text-white/40 max-w-60">
              Tap to take a photo or choose from your gallery. Text is extracted and analyzed for scam signs.
            </p>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-black/50 dark:text-white/50">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Reading screenshot with AI...
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>
      )}

      {preview && !loading && (
        <button
          onClick={() => {
            setPreview(null)
            setFileName('')
          }}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
        >
          Clear screenshot
        </button>
      )}

      <p className="text-xs text-center text-black/40 dark:text-white/30">
        The image is sent to the AI service for a single analysis and is never stored.
      </p>
    </div>
  )
}
