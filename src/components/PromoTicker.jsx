import './PromoTicker.css'

const promos = [
  'FREE DELIVERY ON ORDERS OVER ₹50,000',
  'EASY EMI FROM ₹4,999/MONTH',
  '100% GENUINE KTM PARTS',
  'NEW: 1390 SUPER DUKE R NOW AVAILABLE',
  'FREE 3 SERVICES ON EVERY NEW BIKE',
  'READY TO RACE — READY TO RIDE',
]

export default function PromoTicker() {
  return (
    <div className="promo-ticker">
      <div className="promo-ticker-track">
        {[0, 1].map((rep) => (
          <div className="promo-ticker-group" key={rep} aria-hidden={rep === 1}>
            {promos.map((text) => (
              <span className="promo-ticker-item" key={text}>
                {text}
                <span className="promo-ticker-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
