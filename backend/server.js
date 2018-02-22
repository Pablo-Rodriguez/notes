
const http = require('http')
const express = require('express')

const Database = require('./lib/database')
const App = require('./app')
const config = require('./config/')

module.exports = class Server {
  static async start () {
    try {
      const db = await Database.connect(config.db)

      config.db = db
      const app = new App({router: express(), config})
      const server = http.createServer(app.getRouter())

      await server.listen(config.port)
      console.log(`Magic on port ${config.port}`)
    } catch (err) {
      console.log(err)
    }
  }
}
