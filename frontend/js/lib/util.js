
// Not working on firefox (and probably neither in other browsers...)
export function downloadAsJSON (obj, name) {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(obj))}`
  console.log(data)
  console.log(name)
  const a = document.createElement('a')
  a.setAttribute('href', data)
  a.setAttribute('download', `${name}.json`)
  a.click()
  a.remove()
}

export const prevent = (fn) => (e) => {
  e.preventDefault()
  return fn(e)
}

