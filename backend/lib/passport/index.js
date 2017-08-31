
const passport = require('passport')

const LocalStrategy = require('./local')
const UserModel = require('../../components/user/model')
const Bcrypt = require('../bcrypt')

module.exports = class Passport {
  static configure () {
    passport.serializeUser(Passport.serialize)
    passport.deserializeUser(Passport.deserialize)

    passport.use(LocalStrategy.use(UserModel, Bcrypt))
  }

  static serialize (account, cb) {
    return cb(null, account._id)
  }

  static async deserialize (id, cb) {
    const account = UserModel.findById(id)
    return cb(null, account)
  }
}
