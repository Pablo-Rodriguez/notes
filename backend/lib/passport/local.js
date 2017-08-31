
const Strategy = require('passport-local')

module.exports = class LocalStrategy {
  static use (Model) {
    return new Strategy(LocalStrategy.strategy(Model))
  }

  static strategy (Model, Bcrypt) {
    return async (name, password, done) => {
      try {
        let user = await Model.getByName(name)
        if (user != null) {
          let validPassword = await Bcrypt.compare(password, user.password)
          if (validPassword) {
            return done(null, user)
          }
        }
        throw new Error('Wrong Account')
      } catch (err) {
        done(null, false, err)
      }
    }
  }
}
