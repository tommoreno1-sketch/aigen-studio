import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { useCredits } from '../context/CreditsContext'
import PageHeader from '../components/PageHeader'
import GenerateButton from '../components/GenerateButton'
import OutputPanel from '../components/OutputPanel'

const COST = 5

const STYLES = [
  'Photorealistic', 'Anime', 'Oil Painting', 'Watercolor',
  'Digital Art', 'Cinematic', 'Sketch', 'Pixel Art',
]

const RATIOS = ['1:1', '16:9', '4:3', '3:4', '9:16']

export default function TextToImage() {
  const { credits, spend } = useCredits()
  const [prompt, setPrompt] = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [style, setStyle] = useState('Photorealistic')
  const [ratio, setRatio] = useState('1:1')
  const [steps, setSteps] = useState(30)
  const [guidance, setGuidance] = useState(7)
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
      const res = await fetch('/api/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${style} style: ${prompt}`, negativePrompt: negPrompt, ratio, steps, guidance }),
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
        icon={ImageIcon}
        title="Text to Image"
        description="Transform your words into stunning images using AI"
        color="#818cf8"
        cost={COST}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
        {/* Controls */}
        <div className="space-y-5 overflow-y-auto pr-1">
          {/* Prompt */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>PROMPT</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="A photorealistic portrait of a fox wearing a suit, dramatic lighting, shallow depth of field…"
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none border transition-all focus:border-purple-500/50 placeholder:text-gray-600"
              style={{ background: '#111118', borderColor: '#1a1a26' }}
            />
          </div>

          {/* Negative prompt */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>NEGATIVE PROMPT</label>
            <textarea
              value={negPrompt}
              onChange={e => setNegPrompt(e.target.value)}
              placeholder="blurry, low quality, watermark…"
              rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none border transition-all focus:border-purple-500/50 placeholder:text-gray-600"
              style={{ background: '#111118', borderColor: '#1a1a26' }}
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>STYLE</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className="py-2 px-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: style === s ? '#6c47ff22' : '#111118',
                    color: style === s ? '#a78bfa' : '#5a5a80',
                    border: `1px solid ${style === s ? '#6c47ff44' : '#1a1a26'}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>ASPECT RATIO</label>
            <div className="flex gap-2">
              {RATIOS.map(r => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: ratio === r ? '#6c47ff22' : '#111118',
                    color: ratio === r ? '#a78bfa' : '#5a5a80',
                    border: `1px solid ${ratio === r ? '#6c47ff44' : '#1a1a26'}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center justify-between text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>
                <span>STEPS</span>
                <span className="text-white">{steps}</span>
              </label>
              <input type="range" min={10} max={50} value={steps} onChange={e => setSteps(+e.target.value)}
                className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>
                <span>GUIDANCE</span>
                <span className="text-white">{guidance}</span>
              </label>
              <input type="range" min={1} max={20} value={guidance} onChange={e => setGuidance(+e.target.value)}
                className="w-full accent-purple-500" />
            </div>
          </div>

          <GenerateButton loading={loading} cost={COST} credits={credits} onClick={generate} />
        </div>

        {/* Output */}
        <OutputPanel type="image" url={url} loading={loading} error={error} />
      </div>
    </div>
  )
}
