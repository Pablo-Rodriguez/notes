
module.exports = {
  morgan: {
    use: false
  },
  db: {
    url: process.env.CLEARDB_DATABASE_URL,
    options: {
      logging: false
    }
  }
}
