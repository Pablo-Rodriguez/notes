
module.exports = {
  port: process.env.PORT || 3000,
  expressSession: {
    saveUninitialized: false,
    resave: false,
    secret: process.env.EXPRESS_SESSION_SECRET || 'secret'
  },
  security: {
    saltRounds: 10
  }
}
