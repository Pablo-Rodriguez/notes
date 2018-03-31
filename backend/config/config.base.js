
module.exports = {
  port: process.env.PORT || 5000,
  sslredirect: {
    use: false
  },
  expressSession: {
    saveUninitialized: false,
    resave: false,
    secret: process.env.EXPRESS_SESSION_SECRET || 'secret'
  },
  security: {
    saltRounds: 10
  }
}
