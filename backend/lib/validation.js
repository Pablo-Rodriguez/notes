
module.exports = class Validation {
  static len (min, max) {
    return {
      args: [min, max],
      msg: `Length must be between ${min} and ${max}.`
    }
  }

  static alphanumeric () {
    return {msg: 'Only letters and numbers are allowed here.'}
  }
}

