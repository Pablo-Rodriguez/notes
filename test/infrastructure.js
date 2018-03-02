
const test = require('ava')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const Util = require('../backend/lib/helpers')

Object.assign(Util, {
  verifyMocks (...mocks) {
    mocks.forEach(mock => mock.verify())
  },

  mockResponse (Response) {
    return Object.assign({}, Response, {
      sendError: sinon.spy(),
      sendData: sinon.spy(),
      sendOK: sinon.spy(),
      handleValidationErrors: Response.handleValidationErrors,
      CUSTOM_BAD_REQUEST: Response.CUSTOM_BAD_REQUEST
    })
  }
})

const {expect} = chai
chai.use(sinonChai)

const Errors = {
  SEQUELIZE_VALIDATION: Object.assign(new Error('SequelizeValidationError'), {
    name: 'SequelizeValidationError',
    type: 'Validation error',
    errors: []
  }),
  simple: new Error('error')
}

module.exports = {test, expect, sinon, Util, Errors}

