
const passport = require('passport')

const LocalStrategy = require('./local')

module.exports = class Passport {
  static configure (UserModel) {
    Passport.UserModel = UserModel
    passport.serializeUser(Passport.serialize)
    passport.deserializeUser(Passport.deserialize)

    passport.use(LocalStrategy.use(Passport.UserModel))
  }

  static serialize (user, cb) {
    return cb(null, user.get('name'))
  }

  static async deserialize (name, cb) {
    const user = await Passport.UserModel.getByName(name)
    return cb(null, user)
  }

  static authenticate (req, res, next, type) {
    return new Promise((resolve, reject) => {
      passport.authenticate(type, (err, user, info) => {
        if (err) {
          reject(err)
        } else if (!user) {
          reject(info.message)
        } else {
          resolve(user)
        }
      })(req, res, next)
    })
  }

  static login (req, user) {
    return new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
