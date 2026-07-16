import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import useLenis from './lib/useLenis'
import Header from './components/Header'
import PromoTicker from './components/PromoTicker'
import CarouselScreen from './components/CarouselScreen'
import DetailScreen from './components/DetailScreen'
import Loader from './components/Loader'
import { bikes } from './data/bikes'

gsap.registerPlugin(Flip)

export default function App() {
  useLenis()

  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('carousel')
  const [activeBikeId, setActiveBikeId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const stageRef = useRef(null)
  const titleRef = useRef(null)
  const pendingRef = useRef(null)
  const carouselScrollRef = useRef(0)

  const activeBike = bikes.find((b) => b.id === activeBikeId) ?? null

  // Shared-element FLIP: the carousel <img>/<hover-card> and the detail
  // <img>/<left-panel> carry the SAME data-flip-id only while their own
  // screen is the current one, so Flip.getState (captured before the
  // screen swap) and Flip.from (run after React re-renders) always
  // resolve to two different DOM nodes with matching ids — no literal
  // reparenting needed, and no risk of Swiper's 3D transform leaking
  // into the flight animation since the animated node is always the
  // untransformed Detail element. Flip.from's `targets` must be passed
  // explicitly (re-queried after the re-render) since it otherwise
  // defaults to the OLD elements from Flip.getState, which would just
  // re-measure themselves as unchanged and prune the whole animation.
  const openDetail = (bikeId) => {
    if (isAnimating || screen !== 'carousel' || !stageRef.current) return
    const targets = stageRef.current.querySelectorAll('[data-flip-id]')
    if (!targets.length) return
    const flipState = Flip.getState(targets, { props: 'borderRadius' })
    carouselScrollRef.current = window.scrollY
    pendingRef.current = { flipState, direction: 'open' }
    setIsAnimating(true)
    setActiveBikeId(bikeId)
    setScreen('detail')
  }

  const closeDetail = () => {
    if (isAnimating || screen !== 'detail' || !stageRef.current) return
    const targets = stageRef.current.querySelectorAll('[data-flip-id]')
    if (!targets.length) return
    const flipState = Flip.getState(targets, { props: 'borderRadius' })
    pendingRef.current = { flipState, direction: 'close' }
    setIsAnimating(true)
    setScreen('carousel')
  }

  useLayoutEffect(() => {
    const pending = pendingRef.current
    if (!pending || !stageRef.current) return
    pendingRef.current = null
    const { flipState, direction } = pending

    const secondaryEls = [titleRef.current, stageRef.current.querySelector('.bike-swiper')].filter(Boolean)
    const leftUiEls = stageRef.current.querySelectorAll('.detail-panel .detail-ui-fade')
    const rightUiEls = stageRef.current.querySelectorAll('.detail-config .detail-ui-fade')

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        if (direction === 'close') setActiveBikeId(null)
      },
    })

    // The two screens share one scroll container, so whatever scrollY the
    // carousel was at carries straight into the (much shorter) detail
    // layout unless we reset it — landing the user mid-way down Specs
    // instead of at the Overview. Snap it before Flip measures the "to"
    // rects, so both the scroll change and the flip's start transform land
    // in the same synchronous paint (no visible jump-then-flip).
    const lenis = window.__lenis
    if (direction === 'open') {
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    } else {
      const restoreY = carouselScrollRef.current
      if (lenis) lenis.scrollTo(restoreY, { immediate: true })
      else window.scrollTo(0, restoreY)
    }

    // Flip.from() defaults vars.targets to state.targets (the OLD elements
    // captured at getState time) unless told otherwise, so it must be
    // pointed explicitly at the freshly-rendered elements sharing the same
    // data-flip-id — otherwise it just re-measures the old (unchanged)
    // elements, sees no difference, and prunes the animation to a no-op.
    const applyTargets = stageRef.current.querySelectorAll('[data-flip-id]')

    const flipDuration = 1.3

    tl.add(
      Flip.from(flipState, {
        targets: applyTargets,
        duration: flipDuration,
        ease: 'power2.inOut',
        absolute: true,
        scale: true,
      }),
      0,
    )

    if (direction === 'open') {
      tl.to(secondaryEls, { autoAlpha: 0, y: -10, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0)
      tl.fromTo(leftUiEls, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, flipDuration - 0.35)
      tl.fromTo(rightUiEls, { autoAlpha: 0, x: 48 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, flipDuration - 0.25)
    } else {
      tl.to(leftUiEls, { autoAlpha: 0, y: 10, duration: 0.2, ease: 'power2.out' }, 0)
      tl.to(rightUiEls, { autoAlpha: 0, x: 32, duration: 0.2, ease: 'power2.out' }, 0)
      tl.fromTo(secondaryEls, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0.3)
    }
  }, [screen, activeBikeId])

  return (
    <div className="app">
      {loading && <Loader onDone={() => setLoading(false)} />}
      <PromoTicker />
      <Header screen={screen} />
      <div className={`stage ${isAnimating ? 'is-animating' : ''}`} ref={stageRef}>
        <div className={`screen ${screen === 'carousel' ? 'screen--active' : 'screen--inactive'}`}>
          <CarouselScreen screen={screen} isActive={screen === 'carousel'} titleRef={titleRef} onOpen={openDetail} />
        </div>
        <div className={`screen ${screen === 'detail' ? 'screen--active' : 'screen--inactive'}`}>
          <DetailScreen
            screen={screen}
            isActive={screen === 'detail'}
            settled={screen === 'detail' && !isAnimating}
            bike={activeBike}
            onBack={closeDetail}
          />
        </div>
      </div>
    </div>
  )
}
