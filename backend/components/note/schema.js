
const mongoose = require('mongoose')

const note = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  body: {
    type: String
  }
})

module.exports = mongoose.model('Note', note)
