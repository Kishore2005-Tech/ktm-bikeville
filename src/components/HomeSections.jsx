import {
  IconFrame,
  IconMoto,
  IconWheel,
  IconBolt,
  IconHandlebar,
  IconSearch,
  IconTag,
  IconCheck,
  IconTruck,
  IconSliders,
  IconShield,
  IconPower,
  IconTorque,
  IconWeight,
  IconPlus,
} from './icons'
import { bikes } from '../data/bikes'
import useReveal from '../lib/useReveal'
import useTilt from '../lib/useTilt'
import './HomeSections.css'

const bikeTypes = [
  { id: 'adventure', label: 'Adventure', Icon: IconFrame },
  { id: 'naked', label: 'Naked', Icon: IconMoto },
  { id: 'enduro', label: 'Enduro', Icon: IconWheel },
  { id: 'street', label: 'Street', Icon: IconBolt },
  { id: 'touring', label: 'Touring', Icon: IconHandlebar },
]

const ctaCards = [
  {
    id: 'buy',
    Icon: IconSearch,
    title: 'Are You Looking For a Bike?',
    body: 'Browse our full KTM range and find the one that fits your ride.',
    cta: 'Find a Bike',
  },
  {
    id: 'sell',
    Icon: IconTag,
    title: 'Want to Sell Your Bike?',
    body: 'Get an instant valuation and trade in towards your next KTM.',
    cta: 'Sell Now',
  },
]

const trustChecklist = ['Genuine KTM Parts Only', 'Certified Technicians', 'Pan-India Delivery', 'Easy EMI Options']

const trustStats = [
  { value: '500+', label: 'Bikes Delivered' },
  { value: '50+', label: 'Cities Served' },
  { value: '4.8★', label: 'Customer Rating' },
]

const popularBikes = bikes.slice(0, 4)

const stepsLeft = [
  { num: '01', Icon: IconSearch, title: 'Choose Your Bike', body: 'Browse the full KTM range by type, price, or riding style.' },
  { num: '02', Icon: IconSliders, title: 'Configure & Customize', body: 'Pick your wheels, colours, and accessories to match your style.' },
]

const stepsRight = [
  { num: '03', Icon: IconTruck, title: 'Doorstep Delivery', body: 'Your bike arrives fully set up and ready to ride.' },
  { num: '04', Icon: IconShield, title: 'After-Sales Support', body: 'Genuine parts and certified service, whenever you need it.' },
]

export default function HomeSections() {
  const browseRef = useReveal([
    { selector: '.browse-section h2', x: -60, rotateY: 25, duration: 0.8 },
    { selector: '.browse-item', y: 40, rotateX: -25, scale: 0.85, duration: 0.7, stagger: 0.08, start: 'top 85%' },
  ])

  const ctaRef = useReveal([{ selector: '.cta-card', y: 60, duration: 0.8, stagger: 0.12 }])

  const trustRef = useReveal([
    { selector: '.trust-img--main', x: -80, rotateY: 25, duration: 1 },
    { selector: '.trust-img--accent', x: -60, rotateY: 20, duration: 1, start: 'top 70%' },
    { selector: '.trust-eyebrow, .trust-content h2, .trust-copy', y: 40, duration: 0.8, stagger: 0.1 },
    { selector: '.trust-checklist li, .trust-stat', y: 30, scale: 0.9, duration: 0.6, stagger: 0.06, start: 'top 70%' },
  ])

  const popularRef = useReveal([
    { selector: '.popular-eyebrow, .popular-section h2', y: 30, duration: 0.7 },
    { selector: '.popular-card', y: 60, rotateX: -25, scale: 0.9, duration: 0.8, stagger: 0.1, start: 'top 85%' },
  ])
  useTilt(popularRef, '.popular-card', { maxTilt: 10, scale: 1.05 })

  const howRef = useReveal([
    { selector: '.how-eyebrow, .how-it-works h2', y: 30, duration: 0.7 },
    { selector: '.how-media', scale: 0.8, rotateY: -15, duration: 1, start: 'top 75%' },
    { selector: '.how-step', y: 40, rotateX: -20, duration: 0.7, stagger: 0.1, start: 'top 80%' },
  ])

  return (
    <>
      <section className="browse-section" ref={browseRef}>
        <h2>Browse by Type</h2>
        <div className="browse-row">
          {bikeTypes.map(({ id, label, Icon }) => (
            <button key={id} type="button" className="browse-item">
              <span className="browse-icon">
                <Icon />
              </span>
              <span className="browse-label">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cta-section" ref={ctaRef}>
        {ctaCards.map((card) => (
          <div key={card.id} className={`cta-card cta-card--${card.id}`}>
            <span className="cta-icon">
              <card.Icon />
            </span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <button type="button" className="cta-btn">
              {card.cta}
            </button>
          </div>
        ))}
      </section>

      <section className="trust-section" ref={trustRef}>
        <div className="trust-media">
          <img src="/bikes/200-duke-hero.png" alt="KTM Duke" className="trust-img trust-img--main" />
          <img src="/bikes/250-adventure-x-hero.png" alt="KTM Adventure" className="trust-img trust-img--accent" />
        </div>
        <div className="trust-content">
          <span className="trust-eyebrow">WHY RIDE WITH US</span>
          <h2>Ridden by Passion. Powered by Trust.</h2>
          <p className="trust-copy">
            From your first test ride to years of after-sales service, Bikeville stands behind every KTM we sell —
            genuine parts, certified technicians, and a dealership network you can rely on.
          </p>
          <ul className="trust-checklist">
            {trustChecklist.map((item) => (
              <li key={item}>
                <IconCheck /> {item}
              </li>
            ))}
          </ul>
          <div className="trust-stats">
            {trustStats.map((stat) => (
              <div key={stat.label} className="trust-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="popular-section" ref={popularRef}>
        <div className="popular-wave popular-wave--top" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C240,100 480,0 720,15 C960,30 1200,95 1440,35 L1440,100 L0,100 Z" />
          </svg>
        </div>

        <div className="popular-body">
          <span className="popular-eyebrow">HANDPICKED FOR YOU</span>
          <h2>Popular Bikes</h2>
          <div className="popular-grid">
            {popularBikes.map((bike) => (
              <div key={bike.id} className="popular-card">
                <div className="popular-card-img">
                  <img src={bike.image} alt={bike.name} />
                </div>
                <span className="popular-card-brand">{bike.brand}</span>
                <h4>{bike.shortName}</h4>
                <div className="popular-card-specs">
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
                <div className="popular-card-bottom">
                  <strong>{bike.priceLabel}</strong>
                  <button type="button" className="popular-card-btn" aria-label={`Add ${bike.name}`}>
                    <IconPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="popular-wave popular-wave--bottom" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C240,100 480,0 720,15 C960,30 1200,95 1440,35 L1440,0 L0,0 Z" />
          </svg>
        </div>
      </section>

      <section className="how-it-works" ref={howRef}>
        <span className="how-eyebrow">SIMPLE, START TO FINISH</span>
        <h2>How It Works</h2>
        <div className="how-grid">
          <div className="how-col">
            {stepsLeft.map((step) => (
              <div key={step.num} className="how-step">
                <span className="how-num">{step.num}</span>
                <span className="how-icon">
                  <step.Icon />
                </span>
                <h5>{step.title}</h5>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="how-media">
            <img src="/bikes/ktm.png" alt="KTM Duke" />
          </div>
          <div className="how-col">
            {stepsRight.map((step) => (
              <div key={step.num} className="how-step">
                <span className="how-num">{step.num}</span>
                <span className="how-icon">
                  <step.Icon />
                </span>
                <h5>{step.title}</h5>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
