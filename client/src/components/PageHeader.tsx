import type { ComponentType } from 'react'

interface Props {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string
  description: string
  color: string
  cost: number
}

export default function PageHeader({ icon: Icon, title, description, color, cost }: Props) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '22' }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: color + '1a', color }}
          >
            {cost} credits
          </span>
        </div>
        <p className="text-sm mt-0.5" style={{ color: '#5a5a80' }}>{description}</p>
      </div>
    </div>
  )
}
