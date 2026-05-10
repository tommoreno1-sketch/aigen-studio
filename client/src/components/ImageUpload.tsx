import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

interface Props {
  value: string | null
  onChange: (dataUrl: string | null) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Upload Image' }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-xs font-medium mb-2" style={{ color: '#5a5a80' }}>{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: '#2e2e45' }}>
          <img src={value} alt="Uploaded" className="w-full h-44 object-cover" />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <X size={13} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => {
            e.preventDefault()
            setDrag(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all"
          style={{
            borderColor: drag ? '#6c47ff' : '#2e2e45',
            background: drag ? '#6c47ff11' : '#111118',
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1a1a26' }}>
            <Upload size={16} style={{ color: '#5a5a80' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">Drop image or click to browse</p>
            <p className="text-xs mt-0.5" style={{ color: '#5a5a80' }}>PNG, JPG, WEBP up to 10MB</p>
          </div>
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
    </div>
  )
}
