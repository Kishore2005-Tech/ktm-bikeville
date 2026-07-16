import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  IconArrowLeft,
  IconPlus,
  IconMoto,
  IconSpeedo,
  IconBolt,
  IconWheel,
  IconFrame,
  IconSeat,
  IconHandlebar,
} from './icons'
import SocialIcons from './SocialIcons'
import { partSelectors, wheelVariants } from '../data/bikes'
import { scrollToEl } from '../lib/scrollTo'
import './Detail.css'

gsap.registerPlugin(ScrollTrigger)

const railIcons = [
  { id: 'ride', Icon: IconMoto },
  { id: 'speed', Icon: IconSpeedo },
  { id: 'power', Icon: IconBolt },
]

const partIcons = { wheels: IconWheel, frame: IconFrame, seat: IconSeat, handlebar: IconHandlebar }

export default function DetailScreen({ screen, isActive, settled, bike, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [activeRail, setActiveRail] = useState('ride')
  const [activePart, setActivePart] = useState('wheels')
  const [activeWheel, setActiveWheel] = useState('default')

  const imgRef = useRef(null)
  const panelRef = useRef(null)
  const overviewTabRef = useRef(null)
  const specsTabRef = useRef(null)
  const underlineRef = useRef(null)
  const wheelUnderlineRef = useRef(null)
  const wheelThumbRefs = useRef({})
  const specsSectionRef = useRef(null)
  const detailTopRef = useRef(null)
  const floatTweenRef = useRef(null)
  const isFirstTabRender = useRef(true)
  const isFirstWheelRender = useRef(true)

  const flipIdBike = screen === 'detail' && bike ? `flip-bike-${bike.id}` : undefined
  const flipIdPanel = screen === 'detail' && bike ? `flip-panel-${bike.id}` : undefined

  // Reset the configurator whenever a different bike is opened.
  useEffect(() => {
    setActiveTab('overview')
    setActivePart('wheels')
    setActiveWheel('default')
  }, [bike?.id])

  // Sliding underline under Overview / Specs tabs.
  useGSAP(() => {
    const el = activeTab === 'overview' ? overviewTabRef.current : specsTabRef.current
    if (!el || !underlineRef.current) return
    if (isFirstTabRender.current) {
      gsap.set(underlineRef.current, { x: el.offsetLeft, width: el.offsetWidth })
      isFirstTabRender.current = false
      return
    }
    gsap.to(underlineRef.current, { x: el.offsetLeft, width: el.offsetWidth, duration: 0.35, ease: 'power2.out' })
  }, [activeTab])

  // Sliding coral underline beneath the active wheel thumbnail.
  useGSAP(() => {
    const el = wheelThumbRefs.current[activeWheel]
    if (!el || !wheelUnderlineRef.current) return
    if (isFirstWheelRender.current) {
      gsap.set(wheelUnderlineRef.current, { x: el.offsetLeft, width: el.offsetWidth })
      isFirstWheelRender.current = false
      return
    }
    gsap.to(wheelUnderlineRef.current, { x: el.offsetLeft, width: el.offsetWidth, duration: 0.35, ease: 'power2.out' })
  }, [activeWheel])

  // Idle float loop only runs once the flip has fully settled, otherwise
  // it would fight the Flip transform tween on the same element.
  useEffect(() => {
    if (settled && imgRef.current) {
      floatTweenRef.current = gsap.to(imgRef.current, {
        y: '+=6',
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
    return () => {
      floatTweenRef.current?.kill()
      floatTweenRef.current = null
      if (imgRef.current) gsap.set(imgRef.current, { clearProps: 'y' })
    }
  }, [settled, bike?.id])

  // Specs section fade/slide-up reveal, wired fresh each time the detail
  // screen becomes the active one so ScrollTrigger measures real layout.
  useGSAP(
    () => {
      if (!isActive || !specsSectionRef.current) return
      const rows = specsSectionRef.current.querySelectorAll('.specs-row')
      const anim = gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: specsSectionRef.current, start: 'top 85%' },
        },
      )
      const st = ScrollTrigger.create({
        trigger: specsSectionRef.current,
        start: 'top 60%',
        end: 'bottom top',
        onEnter: () => setActiveTab('specs'),
        onLeaveBack: () => setActiveTab('overview'),
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        anim.scrollTrigger?.kill()
        st.kill()
      }
    },
    { dependencies: [isActive, bike?.id] },
  )

  const selectTab = (tab) => {
    setActiveTab(tab)
    if (tab === 'specs') scrollToEl(specsSectionRef.current, -100)
    else scrollToEl(detailTopRef.current, -20)
  }

  const selectWheel = (variant) => {
    if (variant.id === activeWheel) return
    setActiveWheel(variant.id)
    gsap
      .timeline()
      .to(imgRef.current, { scale: 0.93, opacity: 0.7, duration: 0.15, ease: 'power2.in' })
      .to(imgRef.current, { scale: 1, opacity: 1, filter: variant.filter, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <section className="detail-screen" aria-hidden={!isActive} ref={detailTopRef}>
      <div className="detail-split">
        <div className="detail-panel" ref={panelRef} data-flip-id={flipIdPanel}>
          <div className="detail-panel-content">
            <div className="detail-icon-rail detail-ui-fade">
              {railIcons.map(({ id, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`rail-btn ${activeRail === id ? 'active' : ''}`}
                  onClick={() => setActiveRail(id)}
                  aria-label={id}
                >
                  <Icon />
                </button>
              ))}
            </div>

            <div className="detail-panel-header detail-ui-fade">
              <h2>{bike ? `${bike.brand} ${bike.name}` : ''}</h2>
              <div className="detail-tabs">
                <button ref={overviewTabRef} type="button" className={activeTab === 'overview' ? 'active' : ''} onClick={() => selectTab('overview')}>
                  Overview
                </button>
                <button ref={specsTabRef} type="button" className={activeTab === 'specs' ? 'active' : ''} onClick={() => selectTab('specs')}>
                  Specs
                </button>
                <span className="tab-underline" ref={underlineRef} />
              </div>
            </div>

            <div className="detail-bike-wrap">
              {bike && <img ref={imgRef} data-flip-id={flipIdBike} className="detail-bike-img" src={bike.image} alt={bike.name} />}
            </div>

            <div className="detail-price-row detail-ui-fade">
              <div>
                <span className="label">Price</span>
                <strong>{bike?.priceLabel}</strong>
              </div>
              <button type="button" className="add-to-cart-btn">
                <IconPlus /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="detail-config">
          <div className="detail-config-content detail-ui-fade">
            <button type="button" className="back-btn" onClick={onBack}>
              <IconArrowLeft /> Back
            </button>

            <h2 className="config-heading">Configure the Bike</h2>

            <div className="part-selectors">
              {partSelectors.map((part) => {
                const Icon = partIcons[part.id]
                return (
                  <button
                    key={part.id}
                    type="button"
                    className={`part-btn ${activePart === part.id ? 'active' : ''}`}
                    onClick={() => setActivePart(part.id)}
                    aria-label={part.label}
                  >
                    <Icon />
                  </button>
                )
              })}
            </div>

            {activePart === 'wheels' ? (
              <div className="wheels-section">
                <h4>Wheels</h4>
                <div className="wheel-thumbs">
                  {wheelVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      ref={(el) => (wheelThumbRefs.current[variant.id] = el)}
                      className={`wheel-thumb ${activeWheel === variant.id ? 'active' : ''}`}
                      onClick={() => selectWheel(variant)}
                    >
                      <span className="wheel-thumb-circle" style={{ background: variant.swatch }} />
                      <span className="wheel-thumb-label">{variant.label}</span>
                    </button>
                  ))}
                  <span className="wheel-underline" ref={wheelUnderlineRef} />
                </div>
              </div>
            ) : (
              <div className="wheels-section">
                <h4>{partSelectors.find((p) => p.id === activePart)?.label}</h4>
                <p className="part-placeholder">Custom {activePart} options coming soon.</p>
              </div>
            )}

            <SocialIcons />
          </div>
        </div>
      </div>

      <div className="specs-section" ref={specsSectionRef}>
        <h3>Specifications</h3>
        <div className="specs-list">
          {bike?.specs.map((spec) => (
            <div className="specs-row" key={spec.label}>
              <span>{spec.label}</span>
              <span>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
