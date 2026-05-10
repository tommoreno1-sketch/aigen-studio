import { useState } from 'react'
import { VideoIcon } from 'lucide-react'
import { useCredits } from '../context/CreditsContext'
import PageHeader from '../components/PageHeader'
import GenerateButton from '../components/GenerateButton'
import OutputPanel from '../components/OutputPanel'

const COST = 20

const DURATIONS = [3, 5, 8]
const MOTIONS = ['Static', 'Slow', 'Medium', 'Fast', 'Dynamic']

export default function TextToVideo() {
  const { credits, spend } = useCredits()
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(5)
  const [motion, setMotion] = useState('Medium')
  const [fps, setFps] = useState(24)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    if (!spend(COST)) return
    setLoading(true)
    setError(null)
    setUrl(null)
    try {
      const res = await fetch('/api/text-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, motion, fps }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setUrl(data.url)
    } catch (e: any) {
      setError(e.message)
      spend(-COST)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 h-full">
      <PageHeader
        icon={VideoIcon}
        title="Text to Video"
        description="Generate cinematic video clips from text descriptions"
        color="#f472b6"
        cost={COST}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
        <div className="space-y-5 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>VIDEO PROMPT</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="A slow motion shot of ocean waves crashing on a rocky cliff at sunset, cinematic, 4K…"
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none border transition-all focus:border-pink-500/50 placeholder:text-gray-600"
              style={{ background: '#111118', borderColor: '#1a1a26' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>DURATION</label>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: duration === d ? '#f472b622' : '#111118',
                    color: duration === d ? '#f472b6' : '#5a5a80',
                    border: `1px solid ${duration === d ? '#f472b644' : '#1a1a26'}`,
                  }}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>MOTION INTENSITY</label>
            <div className="flex gap-2">
              {MOTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setMotion(m)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: motion === m ? '#f472b622' : '#111118',
                    color: motion === m ? '#f472b6' : '#5a5a80',
                    border: `1px solid ${motion === m ? '#f472b644' : '#1a1a26'}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>
              <span>FRAME RATE</span>
              <span className="text-white">{fps} FPS</span>
            </label>
            <input type="range" min={12} max={60} step={6} value={fps} onChange={e => setFps(+e.target.value)}
              className="w-full accent-pink-500" />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: '#3d3d5c' }}>
              <span>12</span><span>24</span><span>30</span><span>60</span>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="rounded-xl p-4 border" style={{ background: '#111118', borderColor: '#1a1a26' }}>
            <p className="text-xs font-medium mb-3" style={{ color: '#5a5a80' }}>GENERATION ESTIMATE</p>
            <div className="space-y-2">
              {[
                { label: 'Base cost', value: '15 cr' },
                { label: `Duration (${duration}s)`, value: `+${(duration - 3) * 1} cr` },
                { label: 'Processing', value: `+${fps >= 30 ? 3 : 2} cr` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: '#5a5a80' }}>{label}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t flex justify-between text-sm font-medium" style={{ borderColor: '#1a1a26' }}>
                <span style={{ color: '#f472b6' }}>Total</span>
                <span className="text-white">{COST} credits</span>
              </div>
            </div>
          </div>

          <GenerateButton
            loading={loading}
            cost={COST}
            credits={credits}
            onClick={generate}
            label="Generate Video"
          />
        </div>

        <OutputPanel type="video" url={url} loading={loading} error={error}
          placeholder="Your generated video will appear here" />
      </div>
    </div>
  )
}
