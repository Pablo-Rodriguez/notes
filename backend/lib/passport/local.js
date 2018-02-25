
const Strategy = require('passport-local')

module.exports = class LocalStrategy {
  static use (UserModel) {
    return new Strategy(LocalStrategy.FIELDS, LocalStrategy.strategy(UserModel))
  }

  static get FIELDS () {
    return {
      usernameField: 'name',
      passwordField: 'password'
    }
  }

  static strategy (UserModel) {
    return async (name, password, done) => {
      try {
        let user = await UserModel.getByName(name)
        if (user != null) {
          let validPassword = await UserModel.comparePassword(password, user.get('password'))
          if (validPassword) {
            return done(null, user)
          }
        }
        throw new Error('WrongAccount')
      } catch (error) {
        done(null, false, error)
      }
    }
  }
}
