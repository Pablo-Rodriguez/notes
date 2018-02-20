
const {test, sinon, Util, Errors} = require('../../infrastructure')
const createController = require('../../../backend/services/user/controller')
const Response = require('../../../backend/base/response')
const Passport = require('../../../backend/lib/passport')

const user = {
  name: 'test',
  password: 'testtest',
  get: function (prop) { return this[prop] }
}

const req = {
  body: {
    username: user.name,
    password: user.password
  },
  login: (user, fn) => fn()
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
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST([])))
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
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login without credentials', async t => {
  t.context.Model.getByName.never()
  t.context.Model.comparePassword.never()
  await t.context.Controller.login({body: {}}, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.BAD_REQUEST))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login with wrong username', async t => {
  t.context.Model.getByName.returns(Promise.resolve(null)).once().withArgs(user.name)
  t.context.Model.comparePassword.never()
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.BAD_REQUEST))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login with wrong password', async t => {
  t.context.Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  t.context.Model.comparePassword.returns(Promise.resolve(false)).once().withArgs(user.password, user.password)
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.BAD_REQUEST))
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
})

test('Login throws error', async t => {
  t.context.Model.getByName.throws(new Error('error'))
  await t.context.Controller.login(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
})

test('Logout', t => {
  t.context.Controller.logout({
    logout: sinon.spy()
  }, res)
  t.truthy(t.context.Response.sendOK.calledOnce)
  t.truthy(t.context.Response.sendOK.calledWith(res))
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
    CUSTOM_BAD_REQUEST: Response.CUSTOM_BAD_REQUEST
  })
  Passport.configure(t.context.Model)
  t.context.Controller = createController(t.context.Model, t.context.Response, {
    Passport, parseError: Util.parseError(t.context.Response)})
}
