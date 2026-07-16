import { IconInstagram, IconFacebook, IconTwitter } from './icons'

export default function SocialIcons() {
  return (
    <div className="social-icons">
      <a className="social-icon-btn" href="#" aria-label="Instagram">
        <IconInstagram />
      </a>
      <a className="social-icon-btn" href="#" aria-label="Facebook">
        <IconFacebook />
      </a>
      <a className="social-icon-btn" href="#" aria-label="Twitter">
        <IconTwitter />
      </a>
    </div>
  )
}
