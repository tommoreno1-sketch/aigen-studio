import express from 'express'
import cors from 'cors'
import { fal } from '@fal-ai/client'
import 'dotenv/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

fal.config({ credentials: process.env.FAL_KEY })

// Convert a base64 data URL to an uploaded fal.ai storage URL
async function uploadDataUrl(dataUrl) {
  const [meta, b64] = dataUrl.split(',')
  const mimeType = meta.match(/:(.*?);/)[1]
  const buffer = Buffer.from(b64, 'base64')
  const blob = new Blob([buffer], { type: mimeType })
  const url = await fal.storage.upload(blob)
  return url
}

// Text → Image  (FLUX.1 Schnell — fast)
app.post('/api/text-to-image', async (req, res) => {
  try {
    const { prompt, negativePrompt = '', ratio = '1:1', steps = 4, guidance = 3.5 } = req.body

    const sizes = {
      '1:1':  { width: 1024, height: 1024 },
      '16:9': { width: 1344, height: 768  },
      '4:3':  { width: 1152, height: 896  },
      '3:4':  { width: 896,  height: 1152 },
      '9:16': { width: 768,  height: 1344 },
    }
    const { width, height } = sizes[ratio] || sizes['1:1']

    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt,
        image_size: { width, height },
        num_inference_steps: Math.min(steps, 8),
        num_images: 1,
        enable_safety_checker: false,
      },
    })

    const url = result.data.images?.[0]?.url
    res.json({ url })
  } catch (err) {
    console.error('text-to-image error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Image → Image  (FLUX Dev img2img)
app.post('/api/image-to-image', async (req, res) => {
  try {
    const { image, prompt, strength = 0.7 } = req.body

    const imageUrl = await uploadDataUrl(image)

    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: imageUrl,
        prompt,
        strength,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: false,
      },
    })

    const url = result.data.images?.[0]?.url
    res.json({ url })
  } catch (err) {
    console.error('image-to-image error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Text → Video  (Kling 1.6 standard)
app.post('/api/text-to-video', async (req, res) => {
  try {
    const { prompt, duration = 5 } = req.body

    const result = await fal.subscribe('fal-ai/kling-video/v1.6/standard/text-to-video', {
      input: {
        prompt,
        duration: duration <= 5 ? '5' : '10',
        aspect_ratio: '16:9',
      },
    })

    const url = result.data.video?.url
    res.json({ url })
  } catch (err) {
    console.error('text-to-video error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Image → Video  (Kling 1.6 standard)
app.post('/api/image-to-video', async (req, res) => {
  try {
    const { image, prompt = '', duration = 4 } = req.body

    const imageUrl = await uploadDataUrl(image)

    const result = await fal.subscribe('fal-ai/kling-video/v1.6/standard/image-to-video', {
      input: {
        image_url: imageUrl,
        prompt: prompt || 'smooth natural motion',
        duration: duration <= 5 ? '5' : '10',
      },
    })

    const url = result.data.video?.url
    res.json({ url })
  } catch (err) {
    console.error('image-to-video error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Serve built frontend in production
const distPath = join(__dirname, '../client/dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on :${PORT}`))
