import { useState, FormEvent } from 'react'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'

const VALID_USER = 'testapp'
const VALID_PASS = 'testapp1114!'

interface Props {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (username === VALID_USER && password === VALID_PASS) {
      sessionStorage.setItem('aigen_auth', '1')
      onLogin()
    } else {
      setError('Invalid username or password')
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#08080e' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,71,255,0.08) 0%, transparent 70%)',
        }}
      />

      <div
        className={`relative w-full max-w-sm rounded-2xl border p-8 transition-all ${shaking ? 'animate-bounce' : ''}`}
        style={{ background: '#0d0d15', borderColor: '#1a1a26' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)', boxShadow: '0 0 30px rgba(108,71,255,0.4)' }}
          >
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Aigen Studio</h1>
          <p className="text-sm mt-1" style={{ color: '#5a5a80' }}>Sign in to continue</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border transition-all focus:border-purple-500/60 placeholder:text-gray-700"
              style={{ background: '#111118', borderColor: error ? '#ef444466' : '#1a1a26' }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>PASSWORD</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none border transition-all focus:border-purple-500/60 placeholder:text-gray-700"
                style={{ background: '#111118', borderColor: error ? '#ef444466' : '#1a1a26' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70"
                style={{ color: '#5a5a80' }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: '#ef444411', border: '1px solid #ef444433' }}>
              <AlertCircle size={14} style={{ color: '#ef4444' }} className="flex-shrink-0" />
              <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 mt-2"
            style={{ background: 'linear-gradient(135deg, #6c47ff, #a855f7)', boxShadow: '0 0 20px rgba(108,71,255,0.3)' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
