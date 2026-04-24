import { useState, useRef } from 'react'

export default function ExtractBar({ onExtract, extracting }) {
  const [url, setUrl] = useState('')
  const [hint, setHint] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [file, setFile] = useState(null)
  const fileRef = useRef()

  const handleSubmit = () => {
    if (!url.trim() && !file) return
    onExtract({ url: url.trim(), file, hint })
    setUrl('')
    setFile(null)
    setHint('')
    setShowHint(false)
  }

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-4">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex gap-2 flex-wrap">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Paste a YouTube, TikTok, or Instagram Reels URL…"
            className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={() => fileRef.current.click()}
            className={[
              'px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors whitespace-nowrap',
              file ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50',
            ].join(' ')}
          >
            {file ? `📎 ${file.name.slice(0, 16)}…` : '📎 Upload video'}
          </button>
          <input ref={fileRef} type="file" accept="video/*,audio/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
          <button
            onClick={handleSubmit}
            disabled={extracting || (!url.trim() && !file)}
            className="px-5 py-2.5 text-sm font-bold rounded-xl bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            {extracting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Extracting…
              </span>
            ) : 'Extract Recipe →'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(h => !h)}
            className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600"
          >
            {showHint ? '− Hide hint' : '+ Add description / caption hint (improves accuracy)'}
          </button>
        </div>

        {showHint && (
          <textarea
            value={hint}
            onChange={e => setHint(e.target.value)}
            placeholder="Paste the video caption, description, or any extra context…"
            rows={2}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 resize-y transition-colors"
          />
        )}
      </div>
    </div>
  )
}
