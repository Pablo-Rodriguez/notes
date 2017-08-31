
const {promisify} = require('util')
const bcrypt = require('bcryptjs')

const config = require('../config/')

const genSalt = promisify(bcrypt.genSalt)
const hash = promisify(bcrypt.hash)

module.exports = class {
  static async hash (word) {
    const salt = await genSalt(config.security.saltRounds)
    return hash(word, salt)
  }

  static async compare (test, real) {
    return bcrypt.compare(test, real)
  }
}
