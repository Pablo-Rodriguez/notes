
const mongoose = require('mongoose')

const Bcrypt = require('../../lib/bcrypt')
const config = require('../../config/')

const {Schema} = mongoose

const user = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

user.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    try {
      const hash = await Bcrypt.hash(this._doc.password, config.security.saltRounds)
      this._doc.password = hash
      next()
    } catch (err) {
      next(err)
    }
  } else {
    next()
  }
})

module.exports = mongoose.model('User', user)
