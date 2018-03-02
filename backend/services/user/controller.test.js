
const {test, expect, sinon, Util, Errors} = require('../../../test/infrastructure')
const createController = require('./controller')
const Messages = require('./messages')
const Response = require('../../base/response')
const Passport = require('../../lib/passport')

test.beforeEach(setGlobals)
test.beforeEach(prepareTest)

test('Signup with correct user', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.create.returns(Promise.resolve()).calledWith(req.body)
  await Controller.signup(req, res)
  expect(Response.sendOK).to.have.been.calledWith(res)
  Util.verifyMocks(Model.create)
})

test('Signup with invalid data', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.create.throws(Errors.SEQUELIZE_VALIDATION).withArgs(req.body)
  await t.context.Controller.signup(req, res)
  expect(Response.sendError).to.have.been
    .calledWith(res, Response.CUSTOM_BAD_REQUEST({fields: []}))
  Util.verifyMocks(Model.create)
})

test('Signup throws error', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.create.throws(Errors.simple).withArgs(req.body)
  await Controller.signup(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.create)
})

test('Login with existing user', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByName.returns(Promise.resolve(req.body)).withArgs(req.body.name)
  Model.comparePassword.returns(Promise.resolve(true))
    .withArgs(req.body.password, req.body.password)
  await Controller.login(req, res)
  expect(Response.sendData).to.have.been
    .calledWith(res, Controller.sessionInfo(req.user))
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Login without credentials', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByName.never()
  Model.comparePassword.never()
  await Controller.login({body: {}}, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  }))
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Login with wrong username', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByName.returns(Promise.resolve(null)).withArgs(req.body.name)
  Model.comparePassword.never()
  await Controller.login(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  }))
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Login with wrong password', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByName.returns(Promise.resolve(req.body)).withArgs(req.user.name)
  Model.comparePassword.returns(Promise.resolve(false)).withArgs(req.body.password, req.body.password)
  await Controller.login(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  }))
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Login throws error', async t => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByName.throws(Errors.simple).withArgs(req.body.name)
  Model.comparePassword.never()
  await Controller.login(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Session. Get current session.', t => {
  const {Controller, Response, req, res} = t.context
  Controller.session(req, res)
  expect(Response.sendData).to.have.been.calledWith(res, Controller.sessionInfo(req.body))
})

test('SessionInfo returns correct fields', t => {
  const {Controller, Response, req, res} = t.context
  const info = Controller.sessionInfo(req.body)
  expect({name: req.body.name}).to.deep.equal(info)
})

test('Logout with logged user', t => {
  const {Controller, Response, req, res} = t.context
  const logout = sinon.spy()
  const isAuthenticated = () => true
  Controller.logout({logout, isAuthenticated}, res)
  expect(Response.sendOK).to.have.been.calledWith(res)
  expect(logout).to.have.callCount(1)
})

test('Logout with not logged user', t => {
  const {Controller, Response, req, res} = t.context
  const logout = sinon.spy()
  const isAuthenticated = () => false
  Controller.logout({logout, isAuthenticated}, res)
  expect(Response.sendOK).to.have.been.calledWith(res)
  expect(logout).to.have.callCount(0)
})

function prepareTest (t) {
  t.context.Response = Util.mockResponse(Response)
  t.context.Model = {
    getByName: sinon.mock(),
    create: sinon.mock(),
    comparePassword: sinon.mock()
  }
  Passport.configure(t.context.Model)
  t.context.Controller = createController(t.context.Model, t.context.Response, {Passport})
}

function setGlobals (t) {
  const user = {
    name: 'test',
    password: 'testtest',
    get: function (prop) { return this[prop] }
  }

  t.context.req = {
    body: user,
    login: (user, fn) => fn(),
    user: user
  }

  t.context.res = {mock: 'res'}
}

