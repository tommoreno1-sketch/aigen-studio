import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { useCredits } from '../context/CreditsContext'
import PageHeader from '../components/PageHeader'
import GenerateButton from '../components/GenerateButton'
import OutputPanel from '../components/OutputPanel'
import ImageUpload from '../components/ImageUpload'

const COST = 20

const CAMERA_MOTIONS = ['Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Orbit', 'Static']

export default function ImageToVideo() {
  const { credits, spend } = useCredits()
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [cameraMotion, setCameraMotion] = useState('Static')
  const [duration, setDuration] = useState(4)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!sourceImage) return
    if (!spend(COST)) return
    setLoading(true)
    setError(null)
    setUrl(null)
    try {
      const res = await fetch('/api/image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: sourceImage, prompt, cameraMotion, duration }),
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
        icon={Wand2}
        title="Image to Video"
        description="Bring your images to life with AI-powered animation"
        color="#fb923c"
        cost={COST}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-100px)]">
        <div className="space-y-5 overflow-y-auto pr-1">
          <ImageUpload
            value={sourceImage}
            onChange={setSourceImage}
            label="SOURCE IMAGE"
          />

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>
              MOTION DESCRIPTION <span style={{ color: '#3d3d5c' }}>(optional)</span>
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="The wind gently moves the leaves, soft bokeh in the background…"
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none border transition-all focus:border-orange-500/50 placeholder:text-gray-600"
              style={{ background: '#111118', borderColor: '#1a1a26' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>CAMERA MOTION</label>
            <div className="grid grid-cols-4 gap-2">
              {CAMERA_MOTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setCameraMotion(m)}
                  className="py-2 px-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: cameraMotion === m ? '#fb923c22' : '#111118',
                    color: cameraMotion === m ? '#fb923c' : '#5a5a80',
                    border: `1px solid ${cameraMotion === m ? '#fb923c44' : '#1a1a26'}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>
              <span>DURATION</span>
              <span className="text-white">{duration} seconds</span>
            </label>
            <input
              type="range" min={2} max={8} step={1} value={duration}
              onChange={e => setDuration(+e.target.value)}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: '#3d3d5c' }}>
              <span>2s</span><span>4s</span><span>6s</span><span>8s</span>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl p-4 border" style={{ background: '#111118', borderColor: '#1a1a26' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#fb923c' }}>TIPS FOR BEST RESULTS</p>
            <ul className="space-y-1.5">
              {[
                'Use high-quality, well-lit source images',
                'Images with clear subjects animate better',
                'Describe the motion you want in the prompt',
                'Simple backgrounds produce smoother results',
              ].map(tip => (
                <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: '#5a5a80' }}>
                  <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#fb923c' }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <GenerateButton
            loading={loading}
            cost={COST}
            credits={credits}
            onClick={generate}
            label="Animate Image"
          />
        </div>

        <OutputPanel type="video" url={url} loading={loading} error={error}
          placeholder="Your animated video will appear here" />
      </div>
    </div>
  )
}
