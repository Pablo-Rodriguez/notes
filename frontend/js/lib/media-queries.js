
const min = (value) => `@media (min-width: ${value}px)`
const max = (value) => `@media (max-width: ${value}px)`

const sizes = {
  phone: 320,
  phablet: 480,
  tablet: 768,
  desktop: 1024,
  large: 1824
}

const q = Object.keys(sizes).reduce((acc, name) => {
  acc[name] = max(sizes[name])
  return acc
}, {})

export const phablet = q.phablet
export const tablet = q.tablet
export const desktop = q.desktop
export const large = q.large

export function createListeners (fn) {
  const matchers = Object.keys(sizes).map(name => {
    return {
      name,
      size: sizes[name],
      match: window.matchMedia(`(max-width: ${sizes[name]}px)`)
    }
  })
  matchers.forEach((data) => data.match.addListener((e) => fn(e, data)))
  return matchers.reduce((acc, {name, match}) => {
    acc[name] = match.matches
    return acc
  }, {})
}

