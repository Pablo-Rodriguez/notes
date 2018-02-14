
const min = (value) => `@media (min-width: ${value}px)`

const sizes = {
  phone: 320,
  phablet: 480,
  tablet: 768,
  desktop: 1024,
  large: 1824
}

const q = Object.keys(sizes).reduce((acc, name) => {
  acc[name] = min(sizes[name])
  return acc
}, {})

export const phablet = q.phablet
export const tablet = q.tablet
export const desktop = q.desktop
export const large = q.large

