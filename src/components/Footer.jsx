import { IconInstagram, IconFacebook, IconTwitter } from './icons'
import './Footer.css'

const quickLinks = ['Home', 'Bikes', 'Accessories', 'Contact']

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C240,100 480,0 720,15 C960,30 1200,95 1440,35 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-inner">
          <div className="footer-col footer-brand">
            <h3>
              <span className="accent">KTM</span> Bikeville
            </h3>
            <p>Ride the thrill. Own the road.</p>
            <div className="footer-social">
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
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Address</h4>
            <p>
              KTM Bikeville Showroom
              <br />
              MG Road, Bengaluru, KA 560001
              <br />
              hello@ktmbikeville.com
            </p>
          </div>

          <div className="footer-col">
            <h4>Opening Hours</h4>
            <p>
              Mon &ndash; Fri: 9am &ndash; 8pm
              <br />
              Sat &ndash; Sun: 10am &ndash; 6pm
            </p>
          </div>
        </div>

        <div className="footer-bottom">&copy; {new Date().getFullYear()} KTM MotoVerse. All rights reserved.</div>
      </div>
    </footer>
  )
}
