import { useEffect, useRef, useState } from 'react'
import './Loader.css'

const FALLBACK_MS = 4500
const FADE_MS = 600

export default function Loader({ onDone }) {
  const videoRef = useRef(null)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [])

  useEffect(() => {
    const finish = () => {
      setFadingOut(true)
      setTimeout(onDone, FADE_MS)
    }
    // Autoplay can be blocked, or the ended event can simply not fire in
    // some browsers - this fallback guarantees the site is never stuck
    // behind the loader.
    const fallback = setTimeout(finish, FALLBACK_MS)

    const video = videoRef.current
    video?.play().catch(() => {})

    const handleEnded = () => {
      clearTimeout(fallback)
      finish()
    }
    video?.addEventListener('ended', handleEnded)

    return () => {
      clearTimeout(fallback)
      video?.removeEventListener('ended', handleEnded)
    }
  }, [onDone])

  return (
    <div className={`loader ${fadingOut ? 'loader--out' : ''}`}>
      <video ref={videoRef} className="loader-video" src="/loader-logo.mp4" muted playsInline autoPlay />
    </div>
  )
}
