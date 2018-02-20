
const test = require('ava')
const sinon = require('sinon')

const Util = require('../backend/lib/helpers')

const Errors = {
  SEQUELIZE_VALIDATION: Object.assign(new Error('SequelizeValidationError'), {
    name: 'SequelizeValidationError',
    errors: []
  })
}

module.exports = {test, sinon, Util, Errors}
