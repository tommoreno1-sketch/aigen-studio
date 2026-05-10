import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CreditsProvider } from './context/CreditsContext'
import Layout from './components/Layout'
import TextToImage from './pages/TextToImage'
import ImageToImage from './pages/ImageToImage'
import TextToVideo from './pages/TextToVideo'
import ImageToVideo from './pages/ImageToVideo'
import Login from './pages/Login'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('aigen_auth') === '1')

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  return (
    <CreditsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/text-to-image" replace />} />
            <Route path="text-to-image" element={<TextToImage />} />
            <Route path="image-to-image" element={<ImageToImage />} />
            <Route path="text-to-video" element={<TextToVideo />} />
            <Route path="image-to-video" element={<ImageToVideo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CreditsProvider>
  )
}
