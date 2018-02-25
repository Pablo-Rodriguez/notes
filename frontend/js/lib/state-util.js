
export default  {
  getIfIs (fn, expected, defaultValue = null) {
    try {
      const value = fn()
      return value == expected ? value : defaultValue
    } catch (err) {
      return defaultValue
    }
  },

  getIfIsNot (fn, expected, defaultValue = null) {
    try {
      const value = fn()
      return value != expected ? value : defaultValue
    } catch (err) {
      return defaultValue
    }
  }
}
