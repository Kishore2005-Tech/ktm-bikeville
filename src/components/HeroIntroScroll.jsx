import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconChevronDown, IconTrophy, IconSpeedo, IconMoto } from './icons'
import './HeroIntroScroll.css'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 300
const frameSrc = (i) => `/hero scroll/ezgif-frame-${String(i).padStart(3, '0')}.jpg`

// The title card and the three story beats share one timeline across the
// pinned scroll - only one is ever visible at a time (ranges don't
// overlap), alternating sides left/right so the text doesn't just repeat
// in place as the story advances.
const storyBeats = [
  { id: 'title', side: 'center', eyebrow: 'KTM Bikeville', title: 'Ready to Race', body: 'Scroll to begin the ride.', start: 0, end: 0.14 },
  {
    id: 'engineered',
    side: 'left',
    title: 'Engineered in Austria',
    body: 'Every KTM begins with obsessive engineering — race-proven parts, built to outlast the road.',
    start: 0.18,
    end: 0.42,
  },
  {
    id: 'terrain',
    side: 'right',
    title: 'Built for Every Terrain',
    body: "From city streets to backcountry trails, there's a KTM designed for how you ride.",
    start: 0.46,
    end: 0.7,
  },
  {
    id: 'army',
    side: 'left',
    title: 'Join the Orange Army',
    body: 'Millions of riders worldwide trust KTM to deliver on the promise: Ready to Race.',
    start: 0.74,
    end: 0.96,
  },
]

const metrics = [
  { id: 'years', Icon: IconTrophy, value: '25+', label: 'Years Racing' },
  { id: 'bikes', Icon: IconSpeedo, value: '500+', label: 'Bikes Delivered' },
  { id: 'cities', Icon: IconMoto, value: '50+', label: 'Cities Served' },
]

export default function HeroIntroScroll() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const scrollCueRef = useRef(null)
  const beatRefs = useRef([])

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

        const titleVisible = self.progress < storyBeats[0].end
        gsap.to(scrollCueRef.current, { autoAlpha: titleVisible ? 1 : 0, duration: 0.35, overwrite: true, ease: 'power2.out' })

        storyBeats.forEach((beat, i) => {
          const el = beatRefs.current[i]
          if (!el) return
          const inRange = self.progress >= beat.start && self.progress < beat.end
          const restX = beat.side === 'left' ? -36 : beat.side === 'right' ? 36 : 0
          gsap.to(el, {
            autoAlpha: inRange ? 1 : 0,
            x: inRange ? 0 : restX,
            duration: 0.4,
            overwrite: true,
            ease: 'power2.out',
          })
        })
      },
    })

    return () => {
      st.kill()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero-intro-scroll" ref={sectionRef}>
      <canvas ref={canvasRef} className="hero-intro-scroll-canvas" />
      <div className="hero-intro-scroll-overlay" />

      {storyBeats.map((beat, i) => {
        const TitleTag = beat.side === 'center' ? 'h1' : 'h3'
        return (
          <div key={beat.id} className={`hero-story-beat hero-story-beat--${beat.side}`} ref={(el) => (beatRefs.current[i] = el)}>
            {beat.eyebrow && <span className="hero-intro-scroll-eyebrow">{beat.eyebrow}</span>}
            <TitleTag>{beat.title}</TitleTag>
            <p>{beat.body}</p>
          </div>
        )
      })}

      <div className="hero-intro-scroll-cue" ref={scrollCueRef}>
        <IconChevronDown />
      </div>

      <div className="hero-intro-scroll-metrics">
        {metrics.map((m) => (
          <div key={m.id} className="hero-intro-scroll-metric">
            <span className="hero-intro-scroll-metric-icon">
              <m.Icon />
            </span>
            <div>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
