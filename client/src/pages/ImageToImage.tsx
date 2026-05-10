import { useState } from 'react'
import { Layers } from 'lucide-react'
import { useCredits } from '../context/CreditsContext'
import PageHeader from '../components/PageHeader'
import GenerateButton from '../components/GenerateButton'
import OutputPanel from '../components/OutputPanel'
import ImageUpload from '../components/ImageUpload'

const COST = 8

export default function ImageToImage() {
  const { credits, spend } = useCredits()
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [strength, setStrength] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!sourceImage || !prompt.trim()) return
    if (!spend(COST)) return
    setLoading(true)
    setError(null)
    setUrl(null)
    try {
      const res = await fetch('/api/image-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: sourceImage, prompt, strength }),
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
        icon={Layers}
        title="Image to Image"
        description="Transform any image using AI-guided style and content editing"
        color="#34d399"
        cost={COST}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
        <div className="space-y-5 overflow-y-auto pr-1">
          <ImageUpload value={sourceImage} onChange={setSourceImage} label="SOURCE IMAGE" />

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>TRANSFORMATION PROMPT</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Turn this into a watercolor painting, vibrant colors…"
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none border transition-all focus:border-emerald-500/50 placeholder:text-gray-600"
              style={{ background: '#111118', borderColor: '#1a1a26' }}
            />
          </div>

          {/* Strength slider */}
          <div>
            <label className="flex items-center justify-between text-xs font-medium mb-3" style={{ color: '#5a5a80' }}>
              <span>TRANSFORMATION STRENGTH</span>
              <span className="text-white">{Math.round(strength * 100)}%</span>
            </label>
            <input
              type="range" min={0.1} max={1} step={0.05} value={strength}
              onChange={e => setStrength(+e.target.value)}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: '#3d3d5c' }}>
              <span>Subtle</span>
              <span>Balanced</span>
              <span>Strong</span>
            </div>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Preserve structure', desc: 'Low strength', active: strength < 0.4 },
              { label: 'Balanced', desc: 'Medium strength', active: strength >= 0.4 && strength < 0.7 },
              { label: 'Creative freedom', desc: 'High strength', active: strength >= 0.7 },
            ].map(({ label, desc, active }) => (
              <div
                key={label}
                className="p-3 rounded-xl border transition-all"
                style={{
                  borderColor: active ? '#34d39944' : '#1a1a26',
                  background: active ? '#34d39911' : '#111118',
                }}
              >
                <p className="text-xs font-medium" style={{ color: active ? '#34d399' : '#5a5a80' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#3d3d5c' }}>{desc}</p>
              </div>
            ))}
          </div>

          <GenerateButton
            loading={loading}
            cost={COST}
            credits={credits}
            onClick={generate}
            label="Transform Image"
          />
        </div>

        <OutputPanel type="image" url={url} loading={loading} error={error} />
      </div>
    </div>
  )
}
