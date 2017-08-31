
const mongoose = require('mongoose')

module.exports = class {
  static async connect (url) {
    mongoose.Promise = global.Promise
    await mongoose.connect(url, {useMongoClient: true})
  }
}
