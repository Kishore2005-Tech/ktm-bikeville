import { useEffect, useState } from 'react'
import './Header.css'
import { IconChevronDown, IconCart, IconUser } from './icons'

export default function Header({ cartCount = 2, screen = 'carousel' }) {
  const [onDark, setOnDark] = useState(true)

  useEffect(() => {
    if (screen !== 'carousel') {
      setOnDark(false)
      return
    }
    const heroSlider = document.querySelector('.hero-slider')
    if (!heroSlider) return
    // Measured against the live rect (not scrollY vs. a fixed offsetHeight)
    // so this stays correct regardless of how much dark content sits above
    // hero-slider (the intro scroll section) - dark text mode holds as long
    // as hero-slider's bottom hasn't yet scrolled past the header.
    const onScroll = () => setOnDark(heroSlider.getBoundingClientRect().bottom > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [screen])

  return (
    <header className={`header ${onDark ? 'header--on-dark' : ''}`}>
      <div className="header-logo">
        <span className="header-logo-mark">KTM</span>
        <span>BIKEVILLE</span>
      </div>

      <nav className="header-nav">
        <div className="header-links">
          <a className="header-link" href="#bikes">
            Bikes <IconChevronDown />
          </a>
          <a className="header-link" href="#delivery">
            Delivery
          </a>
          <a className="header-link" href="#contact">
            Contact
          </a>
        </div>

        <div className="header-actions">
          <button type="button" className="header-icon-btn" aria-label="Cart">
            <IconCart />
            {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
          </button>
          <button type="button" className="header-icon-btn" aria-label="Account">
            <IconUser />
          </button>
        </div>
      </nav>
    </header>
  )
}
