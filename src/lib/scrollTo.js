export function scrollToEl(target, offset = 0) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 })
  } else if (target instanceof Element) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
