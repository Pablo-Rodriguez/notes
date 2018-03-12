
export function padding (what, len) {
  const add = len - String(what).length
  return `${'0'.repeat(add > 0 ? add : 0)}${what}`
}

export function parseDate (date) {
  date = new Date(date)
  const day = padding(date.getDate(), 2)
  const month = padding(date.getMonth() + 1, 2)
  const year = date.getFullYear()
  const hour = padding(date.getHours(), 2)
  const minute = padding(date.getMinutes(), 2)
  return `${day}/${month}/${year} ${hour}:${minute}`
}

