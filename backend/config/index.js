
const test = require('./config.testing')
const dev = require('./config.dev')
const prod = require('./config.prod')
const base = require('./config.base')
const {deepAssign} = require('../lib/helpers')

const env = process.env.NODE_ENV
const config = (env === 'test') ? test : ((env === 'production') ? prod : dev)

module.exports = deepAssign({}, base, config)
