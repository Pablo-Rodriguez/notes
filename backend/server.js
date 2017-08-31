
const http = require('http')

const Database = require('./lib/database')
const App = require('./app')
const config = require('./config/')

const app = new App()
const server = http.createServer(app.getRouter())

Database.connect(config.db.url)

server.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Magic on port ${config.port}`)
  }
})
