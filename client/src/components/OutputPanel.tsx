import { Download, RefreshCw } from 'lucide-react'

interface Props {
  type: 'image' | 'video'
  url: string | null
  loading: boolean
  error: string | null
  placeholder?: string
}

export default function OutputPanel({ type, url, loading, error, placeholder }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium" style={{ color: '#5a5a80' }}>Output</span>
        {url && (
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: '#1a1a26', color: '#a78bfa' }}
          >
            <Download size={12} />
            Download
          </a>
        )}
      </div>

      <div
        className="flex-1 rounded-2xl border overflow-hidden flex items-center justify-center min-h-64 relative"
        style={{ borderColor: '#1a1a26', background: '#0d0d15' }}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#0d0d15' }}>
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: '#6c47ff', borderRightColor: '#a855f7' }} />
              <div className="absolute inset-2 w-10 h-10 rounded-full border-2 border-transparent animate-spin animation-delay-150"
                style={{ borderTopColor: '#a855f7', borderRightColor: '#6c47ff', animationDirection: 'reverse', animationDuration: '0.7s' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white mb-1">Generating…</p>
              <p className="text-xs" style={{ color: '#5a5a80' }}>This may take up to 30 seconds</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center px-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#ef444422' }}>
              <RefreshCw size={18} style={{ color: '#ef4444' }} />
            </div>
            <p className="text-sm font-medium text-white mb-1">Generation failed</p>
            <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {!loading && !error && !url && (
          <div className="text-center px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#1a1a26' }}
            >
              <div className="w-8 h-8 rounded-lg" style={{ background: '#2e2e45' }} />
            </div>
            <p className="text-sm font-medium text-white mb-1">No output yet</p>
            <p className="text-xs" style={{ color: '#5a5a80' }}>
              {placeholder || 'Fill in the settings and click Generate'}
            </p>
          </div>
        )}

        {!loading && !error && url && type === 'image' && (
          <img
            src={url}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        )}

        {!loading && !error && url && type === 'video' && (
          <video
            src={url}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  )
}
