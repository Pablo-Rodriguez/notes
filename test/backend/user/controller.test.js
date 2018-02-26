
const {test, sinon, Util, Errors} = require('../../infrastructure')
const createController = require('../../../backend/services/user/controller')
const Messages = require('../../../backend/services/user/messages')
const Response = require('../../../backend/base/response')
const Passport = require('../../../backend/lib/passport')

const user = {
  name: 'test',
  password: 'testtest',
  get: function (prop) { return this[prop] }
}

const req = {
  body: {
    name: user.name,
    password: user.password
  },
  login: (user, fn) => fn(),
  user: {
    name: user.name
  }
}

const res = {mock: 'res'}

test.beforeEach(prepareTest)

test('Signup with correct user', async t => {
  t.context.Model.create.returns(Promise.resolve()).once().calledWith(user)
  await t.context.Controller.signup({body: user}, res)
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(t.context.Model.create.verify())
})

test('Signup with invalid data', async t => {
  t.context.Model.create.throws(Errors.SEQUELIZE_VALIDATION).once().withArgs(user)
  await t.context.Controller.signup({body: user}, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST({fields: []})))
  t.truthy(t.context.Model.create.verify())
})

test('Signup throws error', async t => {
  t.context.Model.create.throws(new Error('error')).once().withArgs(user)
  await t.context.Controller.signup({body: user}, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
  t.truthy(t.context.Model.create.verify())
})

test('Login with existing user', async t => {
  t.context.Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  t.context.Model.comparePassword.returns(Promise.resolve(true)).once().withArgs(user.password, user.password)
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendData.calledWith(res, t.context.Controller.sessionInfo(user)))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login without credentials', async t => {
  t.context.Model.getByName.never()
  t.context.Model.comparePassword.never()
  await t.context.Controller.login({body: {}}, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  })))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login with wrong username', async t => {
  t.context.Model.getByName.returns(Promise.resolve(null)).once().withArgs(user.name)
  t.context.Model.comparePassword.never()
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  })))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login with wrong password', async t => {
  t.context.Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  t.context.Model.comparePassword.returns(Promise.resolve(false)).once().withArgs(user.password, user.password)
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST({
    message: Messages.LOGIN_FAILURE
  })))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login throws error', async t => {
  t.context.Model.getByName.throws(new Error('error'))
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
})

test('Session. Get current session.', t => {
  t.context.Controller.session(req, res)
  t.truthy(t.context.Response.sendData.calledWith(res, t.context.Controller.sessionInfo(user)))
})

test('SessionInfo returns correct fields', t => {
  const info = t.context.Controller.sessionInfo(user)
  t.deepEqual({name: user.name}, info)
})

test('Logout with logged user', t => {
  const logout = sinon.spy()
  const isAuthenticated = () => true
  t.context.Controller.logout({logout, isAuthenticated}, res)
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(logout.calledOnce)
})

test('Logout with not logged user', t => {
  const logout = sinon.spy()
  const isAuthenticated = () => false
  t.context.Controller.logout({logout, isAuthenticated}, res)
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(logout.notCalled)
})

function prepareTest (t) {
  t.context.Model = {
    getByName: sinon.mock(),
    create: sinon.mock(),
    comparePassword: sinon.mock()
  }
  t.context.Response = Util.deepAssign({}, Response, {
    sendOK: sinon.spy(),
    sendError: sinon.spy(),
    sendData: sinon.spy(),
    CUSTOM_BAD_REQUEST: Response.CUSTOM_BAD_REQUEST,
    handleValidationErrors: Response.handleValidationErrors
  })
  Passport.configure(t.context.Model)
  t.context.Controller = createController(t.context.Model, t.context.Response, {Passport})
}
