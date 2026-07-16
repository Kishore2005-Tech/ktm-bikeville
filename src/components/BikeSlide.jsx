import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { IconPower, IconTorque, IconWeight, IconPlus } from './icons'

export default function BikeSlide({ bike, screen, isHovered, isDimmed, onHoverStart, onHoverEnd, onOpen }) {
  const rootRef = useRef(null)
  const imgRef = useRef(null)
  const cardRef = useRef(null)
  const contentRef = useRef(null)
  const timelineRef = useRef(null)

  // Hover-reveal timeline: values match the motion spec (card rise .5s
  // power3.out, bike lift/degrayscale .4s power2.out, content stagger).
  // Built once as a single paused timeline so play()/reverse() stays
  // interruptible under fast repeated hovers instead of fighting itself.
  useGSAP(
    () => {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .to([cardRef.current, contentRef.current], { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 0)
        .fromTo(
          imgRef.current,
          { filter: 'drop-shadow(0 0px 0px rgba(20,22,35,0))' },
          {
            filter: 'drop-shadow(0 26px 30px rgba(20,22,35,0.35))',
            y: -12,
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out',
          },
          0,
        )
        .fromTo(
          contentRef.current.children,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
          0.15,
        )
    },
    { scope: rootRef },
  )

  const handleEnter = () => {
    onHoverStart(bike.id)
    timelineRef.current?.play()
  }

  const handleLeave = () => {
    onHoverEnd(bike.id)
    timelineRef.current?.reverse()
  }

  const handleOpen = () => onOpen(bike.id)

  const flipIdBike = screen === 'carousel' ? `flip-bike-${bike.id}` : undefined
  const flipIdPanel = screen === 'carousel' && isHovered ? `flip-panel-${bike.id}` : undefined

  return (
    <div
      ref={rootRef}
      className="bike-slide"
      style={{ opacity: isDimmed ? 0.35 : 1, transition: 'opacity 0.3s ease' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="bike-slide-card" ref={cardRef} data-flip-id={flipIdPanel} />

      <img
        ref={imgRef}
        data-flip-id={flipIdBike}
        className="bike-slide-img"
        src={bike.image}
        alt={bike.name}
        onClick={handleOpen}
        draggable={false}
      />

      <div className="bike-slide-card-content" ref={contentRef}>
        <div className="bike-slide-heading">
          <span className="bike-slide-brand">{bike.brand}</span>
          <h3 className="bike-slide-name">{bike.shortName}</h3>
        </div>
        <div className="bike-slide-specs">
          <span>
            <IconPower /> {bike.hp}
          </span>
          <span>
            <IconTorque /> {bike.torque}
          </span>
          <span>
            <IconWeight /> {bike.weight}
          </span>
        </div>
        <div className="bike-slide-bottom">
          <div>
            <span className="bike-slide-price-label">PRICE</span>
            <strong className="bike-slide-price">{bike.priceLabel}</strong>
          </div>
          <button type="button" className="bike-slide-plus" onClick={handleOpen} aria-label={`Add ${bike.name}`}>
            <IconPlus />
          </button>
        </div>
      </div>
    </div>
  )
}
