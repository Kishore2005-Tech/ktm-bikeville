import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  IconArrowLeft,
  IconArrowRight,
  IconSpeedo,
  IconHelmet,
  IconTrophy,
  IconEngine,
  IconSuspension,
  IconBrake,
  IconFrame,
  IconTrend,
  IconHeadphones,
  IconInstagram,
  IconFacebook,
  IconTwitter,
} from './icons'
import { bikes } from '../data/bikes'
import { scrollToEl } from '../lib/scrollTo'
import './HeroSlider.css'

gsap.registerPlugin(ScrollTrigger)

// Same technique (and the same easing/duration) as the ice-cream site's
// Hero stack: every bike is always mounted, absolutely stacked, and each
// one's slot is purely a function of its distance from the active index -
// so cycling the index re-flows the whole deck at once instead of
// crossfading a single image.
const STACK_TRANSITION = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
const BG_TRANSITION = { duration: 0.7, ease: 'easeInOut' }

const slotFor = (distance) => {
  if (distance === 0) return { x: -40, y: 15, scale: 1, opacity: 1, blur: 0, zIndex: 30 }
  if (distance === 1) return { x: 130, y: 20, scale: 0.44, opacity: 0.55, blur: 0.8, zIndex: 20 }
  if (distance === 2) return { x: 175, y: 24, scale: 0.3, opacity: 0.32, blur: 1.5, zIndex: 10 }
  return { x: 200, y: 28, scale: 0.26, opacity: 0, blur: 2, zIndex: 0 }
}

const wordPairs = [
  ['RIDE', 'EXPLORE'],
  ['RACE', 'WIN'],
  ['CLIMB', 'CONQUER'],
  ['RIDE', 'DOMINATE'],
  ['RACE', 'DOMINATE'],
]

const bgColors = ['#1a1410', '#1c0f08', '#0f1712', '#171019', '#0c1220']

const featureCards = [
  { id: 'racing', Icon: IconSpeedo, title: 'Racing Performance', body: 'Engineered for speed, built for champions.', target: '.hero-section' },
  { id: 'gear', Icon: IconHelmet, title: 'Premium Accessories', body: 'Gear up with original KTM accessories.', target: '.browse-section' },
  { id: 'dominate', Icon: IconTrophy, title: 'Built to Dominate', body: 'Unmatched control. Unstoppable power.', target: '.popular-section' },
]

const specStripBase = [
  { id: 'suspension', Icon: IconSuspension, label: 'WP Apex Suspension', value: 'Superior Control' },
  { id: 'brakes', Icon: IconBrake, label: 'ByBre Brakes', value: 'Ultimate Safety' },
  { id: 'frame', Icon: IconFrame, label: 'Trellis Frame', value: 'Agile & Durable' },
]

const slides = bikes.map((bike, i) => ({
  bike,
  word1: wordPairs[i % wordPairs.length][0],
  word2: wordPairs[i % wordPairs.length][1],
  bg: bgColors[i % bgColors.length],
}))

const len = slides.length

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  const sectionRef = useRef(null)
  const flyRefs = useRef({})

  const goTo = (i) => setIndex(((i % len) + len) % len)

  const visiblePills = [0, 1, 2].map((d) => slides[(index + d) % len])

  // Entrance: the surrounding chrome fades/slides in once on mount. The
  // bike stack itself is deliberately left untouched here - animating its
  // scale/position at mount previously fought with the scroll-fly effect's
  // rect measurements below (which reads the bike's resting transform),
  // causing the bike to balloon or duplicate. GSAP owns this one-shot
  // entrance; framer-motion still exclusively owns the bike stack and bg
  // crossfade, so the two never touch the same element.
  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-left-card', { x: -60, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
      gsap.from('.hero-pills', { y: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 })
      gsap.from('.hero-feature-card', { x: 60, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.25 })
      gsap.from('.hero-spec-strip', { y: 50, autoAlpha: 0, duration: 0.6, ease: 'power3.out', delay: 0.4 })
      gsap.from('.hero-nav-arrow', { autoAlpha: 0, duration: 0.5, delay: 0.5 })
    }, root)
    return () => ctx.revert()
  }, [])

  // Flies the currently active bike down out of the hero and into its
  // matching (intentionally empty) grid slide below as the user scrolls -
  // same technique as the ice-cream site's Hero->Menu handoff: animate the
  // real element's transform via a scroll-scrubbed tween, no clone needed.
  useLayoutEffect(() => {
    const flyEl = flyRefs.current[slide.bike.id]
    const gridImg = document.querySelector(`.bike-slide-img[data-flip-id="flip-bike-${slide.bike.id}"]`)
    const gridCard = gridImg?.closest('.bike-slide')
    if (!flyEl || !gridImg || !gridCard) return

    document.querySelectorAll('.bike-slide-img').forEach((img) => {
      img.style.opacity = ''
    })
    gridImg.style.opacity = '0'

    let ctx
    let cancelled = false
    // Wait for the framer-motion stack transition to settle AND for web
    // fonts to finish loading before measuring rects - a late font swap
    // reflows the grid section's text and throws off the landing spot.
    const ready = Promise.all([new Promise((resolve) => setTimeout(resolve, 900)), document.fonts?.ready ?? Promise.resolve()])

    ready.then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const dstRect = gridImg.getBoundingClientRect()
        const srcRect = flyEl.querySelector('.hero-bike-img').getBoundingClientRect()
        const flyElRect = flyEl.getBoundingClientRect()
        const srcCx = srcRect.left + srcRect.width / 2
        const srcCy = srcRect.top + srcRect.height / 2
        const dstCx = dstRect.left + dstRect.width / 2
        const dstCy = dstRect.top + dstRect.height / 2
        const wCx = flyElRect.left + flyElRect.width / 2
        const wCy = flyElRect.top + flyElRect.height / 2
        const scale = dstRect.width / srcRect.width

        gsap.set(flyEl, { zIndex: 300, opacity: 1 })

        // Scale pivots around the wrapper's own center (default 50% 50%,
        // left untouched), so the translate has to cancel out the scale's
        // pull on the bike's off-center position within the wrapper.
        const x = dstCx - wCx - scale * (srcCx - wCx)
        const y = dstCy - wCy - scale * (srcCy - wCy)

        gsap.to(flyEl, {
          x,
          y,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            endTrigger: gridCard,
            end: 'top 120px',
            scrub: true,
            onLeave: () => {
              gridImg.style.opacity = '1'
              flyEl.style.opacity = '0'
            },
            onEnterBack: () => {
              gridImg.style.opacity = '0'
              flyEl.style.opacity = '1'
            },
          },
        })
      }, sectionRef)
    })

    return () => {
      cancelled = true
      ctx?.revert()
      gridImg.style.opacity = ''
      flyEl.style.opacity = ''
      gsap.set(flyEl, { zIndex: '', x: 0, y: 0, scale: 1 })
    }
  }, [index])

  return (
    <motion.section className="hero-slider" ref={sectionRef} animate={{ backgroundColor: slide.bg }} transition={BG_TRANSITION}>
      <div className="hero-slider-glow" />

      <div className="hero-pills">
        {visiblePills.map((s) => (
          <button
            key={s.bike.id}
            type="button"
            className={`hero-pill ${s.bike.id === slide.bike.id ? 'is-current' : ''}`}
            onClick={() => goTo(slides.findIndex((sl) => sl.bike.id === s.bike.id))}
          >
            {s.bike.shortName}
          </button>
        ))}
      </div>

      <button type="button" className="hero-nav-arrow hero-nav-arrow--prev" onClick={() => goTo(index - 1)} aria-label="Previous bike">
        <IconArrowLeft />
      </button>
      <button type="button" className="hero-nav-arrow hero-nav-arrow--next" onClick={() => goTo(index + 1)} aria-label="Next bike">
        <IconArrowRight />
      </button>

      <div className="hero-slider-inner">
        <div className="hero-left-card">
          <h1>
            <span className="hero-line">READY TO</span>
            <span className="hero-word hero-word--accent">{slide.word1}</span>
            <span className="hero-line">READY TO</span>
            <span className="hero-word">{slide.word2}</span>
          </h1>
          <p>
            Experience the thrill of performance and precision with the KTM {slide.bike.shortName}. Built for adrenaline. Born to
            dominate.
          </p>
          <div className="hero-left-actions">
            <button type="button" className="hero-btn hero-btn--primary" onClick={() => scrollToEl(document.querySelector('.hero-section'), -80)}>
              Explore Bikes <IconArrowRight />
            </button>
            <button type="button" className="hero-btn hero-btn--ghost" onClick={() => scrollToEl(document.querySelector('.browse-section'), -80)}>
              View Accessories
            </button>
          </div>
          <div className="hero-stat-badge">
            <span className="hero-stat-icon">
              <IconTrend />
            </span>
            <div>
              <strong>{slide.bike.hp}</strong>
              <span>Peak Power</span>
            </div>
          </div>
        </div>

        <div className="hero-center-stage">
          <div className="hero-platform" />
          {slides.map((s, i) => {
            const distance = ((i - index) % len + len) % len
            const slot = slotFor(distance)
            return (
              <div key={s.bike.id} className="hero-bike-fly" ref={(el) => (flyRefs.current[s.bike.id] = el)}>
                <motion.img
                  src={s.bike.image}
                  alt={s.bike.name}
                  className="hero-bike-img"
                  animate={{ x: slot.x, y: slot.y, scale: slot.scale, opacity: slot.opacity, filter: `blur(${slot.blur}px)`, zIndex: slot.zIndex }}
                  transition={STACK_TRANSITION}
                />
              </div>
            )
          })}
        </div>

        <div className="hero-right-cards">
          {featureCards.map((card) => (
            <button key={card.id} type="button" className="hero-feature-card" onClick={() => scrollToEl(document.querySelector(card.target), -80)}>
              <span className="hero-feature-icon">
                <card.Icon />
              </span>
              <h4>{card.title}</h4>
              <p>{card.body}</p>
              <span className="hero-feature-arrow">
                <IconArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="hero-spec-strip">
        <div className="hero-spec-item">
          <span className="hero-spec-icon">
            <IconEngine />
          </span>
          <div>
            <strong>Powerful Engine</strong>
            <span>{slide.bike.specs.find((s) => s.label === 'Engine')?.value ?? slide.bike.hp}</span>
          </div>
        </div>
        {specStripBase.map((item) => (
          <div key={item.id} className="hero-spec-item">
            <span className="hero-spec-icon">
              <item.Icon />
            </span>
            <div>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-slider-social">
        <a href="#" aria-label="Instagram">
          <IconInstagram />
        </a>
        <a href="#" aria-label="Facebook">
          <IconFacebook />
        </a>
        <a href="#" aria-label="Twitter">
          <IconTwitter />
        </a>
      </div>

      <button type="button" className="hero-slider-help">
        <IconHeadphones /> Need Help?
      </button>
    </motion.section>
  )
}
