import { chromium } from 'playwright'

const shotDir = 'C:\\Users\\karth\\AppData\\Local\\Temp\\claude\\d--skincare-main-vite-project\\0097db53-9e10-437e-a9d5-e7f11a411a46\\scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message))

await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })
try {
  await page.waitForSelector('.bike-swiper-slide', { timeout: 15000 })
} catch (e) {
  await page.screenshot({ path: `${shotDir}/00-fail.png`, fullPage: true })
  console.log('BODY_HTML_START')
  console.log((await page.content()).slice(0, 3000))
  console.log('BODY_HTML_END')
  console.log('CONSOLE_ERRORS:', JSON.stringify(errors, null, 2))
  await browser.close()
  process.exit(1)
}
await page.screenshot({ path: `${shotDir}/01-home.png` })

// Hover the centered/active bike slide
const slides = await page.locator('.bike-slide').all()
console.log('slide count', slides.length)
// find the slide with largest bounding box (the coverflow-centered one)
let biggest = null
let biggestArea = 0
for (const s of slides) {
  const box = await s.boundingBox()
  if (box && box.width * box.height > biggestArea) {
    biggestArea = box.width * box.height
    biggest = s
  }
}
await biggest.hover()
await page.waitForTimeout(700)
await page.screenshot({ path: `${shotDir}/02-hover.png` })

// Click the plus button inside that slide to open detail
const plusBtn = biggest.locator('.bike-slide-plus')
await plusBtn.click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${shotDir}/03-mid-flip.png` })
await page.waitForTimeout(600)
await page.screenshot({ path: `${shotDir}/04-detail-settled.png` })

// Click a wheel thumbnail
const wheelBtn = page.locator('.wheel-thumb', { hasText: 'Orange Alloy' })
await wheelBtn.click()
await page.waitForTimeout(500)
await page.screenshot({ path: `${shotDir}/05-wheel-swap.png` })

// Click Specs tab
await page.locator('.detail-tabs button', { hasText: 'Specs' }).click()
await page.waitForTimeout(900)
await page.screenshot({ path: `${shotDir}/06-specs.png` })

// Scroll back up / click overview then Back
await page.locator('.detail-tabs button', { hasText: 'Overview' }).click()
await page.waitForTimeout(900)
const backBtn = page.locator('.back-btn')
await backBtn.click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${shotDir}/07-mid-back.png` })
await page.waitForTimeout(600)
await page.screenshot({ path: `${shotDir}/08-back-settled.png` })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors, null, 2))

await browser.close()
