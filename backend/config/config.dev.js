
module.exports = {
  morgan: {
    use: true
  },
  db: {
    url: 'mysql://test:test@localhost/Notes',
    options: {
      logging: false
    },
    sync: {
      force: true
    }
  }
}
