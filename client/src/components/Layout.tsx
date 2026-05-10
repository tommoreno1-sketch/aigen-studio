import { NavLink, Outlet } from 'react-router-dom'
import { ImageIcon, VideoIcon, Wand2, Layers, Zap, Plus } from 'lucide-react'
import { useCredits } from '../context/CreditsContext'
import { useState } from 'react'

const NAV = [
  { to: '/text-to-image', label: 'Text to Image', icon: ImageIcon, cost: 5, color: '#818cf8' },
  { to: '/image-to-image', label: 'Image to Image', icon: Layers, cost: 8, color: '#34d399' },
  { to: '/text-to-video', label: 'Text to Video', icon: VideoIcon, cost: 20, color: '#f472b6' },
  { to: '/image-to-video', label: 'Image to Video', icon: Wand2, cost: 20, color: '#fb923c' },
]

export default function Layout() {
  const { credits, addCredits } = useCredits()
  const [buyOpen, setBuyOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#08080e' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r" style={{ background: '#0d0d15', borderColor: '#1a1a26' }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: '#1a1a26' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)' }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">Aigen Studio</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-medium px-2 mb-3" style={{ color: '#3d3d5c' }}>GENERATORS</p>
          {NAV.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? { background: '#1a1a2e' } : {}}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: isActive ? color + '22' : '#1a1a26' }}
                  >
                    <Icon size={14} style={{ color: isActive ? color : '#5a5a80' }} />
                  </div>
                  <span>{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Credits panel */}
        <div className="p-3 border-t" style={{ borderColor: '#1a1a26' }}>
          <div className="rounded-xl p-4" style={{ background: '#111118' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: '#5a5a80' }}>CREDITS</span>
              <button
                onClick={() => setBuyOpen(true)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-all hover:opacity-80"
                style={{ background: '#6c47ff22', color: '#a78bfa' }}
              >
                <Plus size={11} />
                Buy
              </button>
            </div>
            <div className="flex items-end gap-1.5 mb-2.5">
              <span className="text-2xl font-bold text-white">{credits}</span>
              <span className="text-xs mb-1" style={{ color: '#5a5a80' }}>remaining</span>
            </div>
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: '#1a1a26' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((credits / 100) * 100, 100)}%`,
                  background: credits > 30
                    ? 'linear-gradient(90deg, #6c47ff, #a855f7)'
                    : credits > 10
                    ? 'linear-gradient(90deg, #f59e0b, #fb923c)'
                    : 'linear-gradient(90deg, #ef4444, #f43f5e)',
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ background: '#08080e' }}>
        <Outlet />
      </main>

      {/* Buy credits modal */}
      {buyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: '#0d0d15', borderColor: '#1a1a26' }}>
            <h2 className="text-lg font-semibold text-white mb-1">Top up credits</h2>
            <p className="text-sm mb-5" style={{ color: '#5a5a80' }}>Choose a credit pack to add to your balance.</p>
            <div className="space-y-3">
              {[
                { label: '100 credits', amount: 100, price: '$4.99', popular: false },
                { label: '500 credits', amount: 500, price: '$19.99', popular: true },
                { label: '1,000 credits', amount: 1000, price: '$34.99', popular: false },
              ].map(({ label, amount, price, popular }) => (
                <button
                  key={amount}
                  onClick={() => { addCredits(amount); setBuyOpen(false) }}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all hover:border-purple-500/50 hover:opacity-90"
                  style={{ borderColor: popular ? '#6c47ff' : '#1a1a26', background: popular ? '#6c47ff11' : '#111118' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{label}</span>
                        {popular && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#6c47ff33', color: '#a78bfa' }}>Popular</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#a78bfa' }}>{price}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setBuyOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
              style={{ color: '#5a5a80' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
