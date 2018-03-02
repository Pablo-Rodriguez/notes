
const {test, expect, sinon, Errors, Util} = require('../../../test/infrastructure')
const Local = require('./local')

test.beforeEach(setGlobals)
test.beforeEach(prepareTest)

test('Local login with valid user and password', async (t) => {
  const {middleware, Model, user} = t.context
  Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  Model.comparePassword.returns(Promise.resolve(true)).once().withArgs(user.password, user.password)
  const done = createDoneSpy(null, user)
  await middleware(user.name, user.password, done)
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Local login with wrong username', async (t) => {
  const {middleware, Model, user} = t.context
  Model.getByName.returns(Promise.resolve(null)).once().withArgs(user.name)
  Model.comparePassword.never()
  const done = createDoneSpy(null, false, new Error('WrongAccount'))
  await middleware(user.name, user.password, done)
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Local login with wrong password', async (t) => {
  const {middleware, Model, user} = t.context
  Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  Model.comparePassword.returns(Promise.resolve(false)).once().withArgs(user.password, user.password)
  const done = createDoneSpy(null, false, new Error('WrongAccount'))
  await middleware(user.name, user.password, done)
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

test('Local login throws error', async (t) => {
  const {middleware, Model, user} = t.context
  Model.getByName.throws(Errors.simple).once().withArgs(user.name)
  Model.comparePassword.never()
  const done = createDoneSpy(null, false, Errors.simple)
  await middleware(user.name, user.password, done)
  Util.verifyMocks(Model.getByName, Model.comparePassword)
})

function createDoneSpy (...args) {
  const done = sinon.mock()
  done.once().calledWith(...args)
  return done
}

function verifyMockCalls (t, done) {
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(t.context.Model.comparePassword.verify())
  t.truthy(done.verify())
}

function prepareTest (t) {
  t.context.Model = {
    getByName: sinon.mock(),
    comparePassword: sinon.mock()
  }
  t.context.middleware = Local.strategy(t.context.Model)
}

function setGlobals (t) {
  t.context.user = {
    name: 'name',
    password: 'password',
    get: function (prop) { return this[prop] }
  }
}

