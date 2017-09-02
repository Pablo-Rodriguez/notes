
const {test, sinon, Util} = require('../../infrastructure')
const createController = require('../../../backend/components/user/controller')
const createModel = require('../../../backend/components/user/model')
const Response = require('../../../backend/base/response')

const user = {
  name: 'name',
  password: 'mypassword$!()/·'
}

test.beforeEach(prepareTest)

test('Signup with correct user', async t => {
  t.context.Model.create.returns(Promise.resolve()).once()
  await t.context.Controller.signup({body: user})
  t.truthy(t.context.Model.create.verify())
  t.truthy(t.context.Response.sendOK.calledOnce)
})

test('Signup with invalid usernames', async t => {
  const invalid = ['', null, undefined, '$!()/·', 'a'.repeat('40')]
  await areInvalid(t, invalid, 'name')
})

test('Signup with existing username', async t => {
  const err = new Error('MongoError')
  err.code = 11000
  t.context.Model.create.throws(err)
  await t.context.Controller.signup({body: user})
  t.truthy(t.context.Response.sendError.calledOnce)
  t.truthy(t.context.Response.sendError.calledWith(undefined, t.context.Response.BAD_REQUEST))
})

test('Signup with invalid passwords', async t => {
  const invalid = ['', null, undefined, 'asd', 'a'.repeat(300)]
  await areInvalid(t, invalid, 'password')
})

test('Signup database failure', async t => {
  const error = 'Test Error'
  t.context.Model.create.throws(error)
  try {
    await t.context.Controller.signup({body: user})
    t.fail()
  } catch (err) {
    t.is(err.name, error)
  }
})

test('Login with existing user', async t => {
  await t.context.Controller.login({
    isAuthenticated: sinon.stub().returns(true)
  })
  t.truthy(t.context.Response.sendOK.calledOnce)
})

test('Login with wrong data', async t => {
  await t.context.Controller.login({
    isAuthenticated: sinon.stub().returns(false)
  })
  t.truthy(t.context.Response.sendError.calledOnce)
  t.truthy(t.context.Response.sendError.calledWith(undefined, t.context.Response.BAD_REQUEST))
})

test('Logout', t => {
  t.context.Controller.logout({
    logout: sinon.spy()
  })
  t.truthy(t.context.Response.sendOK.calledOnce)
  t.truthy(t.context.Response.sendOK.calledWith(undefined))
})

async function areInvalid (t, invalid, field) {
  for (let element of invalid) {
    await t.context.Controller.signup({body: Object.assign({}, user, {
      [field]: element
    })})
    t.truthy(t.context.Response.sendError.calledOnce)
    t.context.Response.sendError.reset()
  }
}

function prepareTest (t) {
  t.context.Model = createModel({})
  t.context.Model.create = sinon.mock()
  t.context.Response = Util.deepAssign({}, Response, {
    sendOK: sinon.spy(),
    sendError: sinon.spy()
  })
  t.context.Controller = createController(t.context.Model, t.context.Response)
}
