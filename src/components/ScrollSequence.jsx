import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollSequence.css'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 300
const frameSrc = (i) => `/scroll/ezgif-frame-${String(i).padStart(3, '0')}.jpg`

const captions = [
  { title: 'Built for the Dirt', body: 'Every KTM is tested where it matters most — off the tarmac.', start: 0, end: 0.34 },
  { title: 'Engineered to Push Limits', body: 'Precision suspension and race-bred power, ready for any terrain.', start: 0.34, end: 0.67 },
  { title: 'Ready When You Are', body: 'From the showroom to the trail, in one ride.', start: 0.67, end: 1 },
]

export default function ScrollSequence() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const captionRefs = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const images = new Array(FRAME_COUNT)
    const frame = { index: 0 }

    function draw() {
      const img = images[frame.index]
      if (!img || !img.naturalWidth) return
      const cw = canvas.width
      const ch = canvas.height
      const canvasRatio = cw / ch
      const imgRatio = img.naturalWidth / img.naturalHeight
      let dw, dh, dx, dy
      if (imgRatio > canvasRatio) {
        dh = ch
        dw = dh * imgRatio
        dx = (cw - dw) / 2
        dy = 0
      } else {
        dw = cw
        dh = dw / imgRatio
        dx = 0
        dy = (ch - dh) / 2
      }
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      draw()
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i + 1)
      if (i === 0) img.onload = () => draw()
      images[i] = img
    }

    resize()
    window.addEventListener('resize', resize)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=' + window.innerHeight * 3,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        frame.index = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * FRAME_COUNT))
        draw()

        captionRefs.current.forEach((el, i) => {
          if (!el) return
          const { start, end } = captions[i]
          const inRange = self.progress >= start && self.progress < end
          gsap.to(el, { autoAlpha: inRange ? 1 : 0, y: inRange ? 0 : 24, duration: 0.35, overwrite: true, ease: 'power2.out' })
        })
      },
    })

    return () => {
      st.kill()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="scroll-sequence" ref={sectionRef}>
      <canvas ref={canvasRef} className="scroll-sequence-canvas" />
      <div className="scroll-sequence-overlay" />
      {captions.map((c, i) => (
        <div key={c.title} className="scroll-caption" ref={(el) => (captionRefs.current[i] = el)}>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </div>
      ))}
    </section>
  )
}
