import { Zap, Loader2 } from 'lucide-react'

interface Props {
  loading: boolean
  cost: number
  credits: number
  onClick: () => void
  label?: string
}

export default function GenerateButton({ loading, cost, credits, onClick, label = 'Generate' }: Props) {
  const disabled = loading || credits < cost

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: disabled ? '#1a1a26' : 'linear-gradient(135deg, #6c47ff, #a855f7)',
        color: disabled ? '#3d3d5c' : 'white',
        boxShadow: disabled ? 'none' : '0 0 20px rgba(108, 71, 255, 0.35)',
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Zap size={16} />
      )}
      <span>{loading ? 'Generating…' : label}</span>
      {!loading && (
        <span
          className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {cost} cr
        </span>
      )}
    </button>
  )
}
