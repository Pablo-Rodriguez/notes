
const {test, sinon} = require('../../infrastructure')
const Local = require('../../../backend/lib/passport/local')

test.beforeEach(prepareTest)

const user = {
  name: 'name',
  password: 'password',
  get: function (prop) { return this[prop] }
}

test('Local login with valid user and password', async (t) => {
  t.context.Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  t.context.Model.comparePassword.returns(Promise.resolve(true)).once().withArgs(user.password, user.password)
  const done = createDoneSpy(null, user)
  await t.context.middleware(user.name, user.password, done)
  verifyMockCalls(t, done)
})

test('Local login with wrong username', async (t) => {
  t.context.Model.getByName.returns(Promise.resolve(null)).once().withArgs(user.name)
  t.context.Model.comparePassword.never()
  const done = createDoneSpy(null, false, new Error('WrongAccount'))
  await t.context.middleware(user.name, user.password, done)
  verifyMockCalls(t, done)
})

test('Local login with wrong password', async (t) => {
  t.context.Model.getByName.returns(Promise.resolve(user)).once().withArgs(user.name)
  t.context.Model.comparePassword.returns(Promise.resolve(false)).once().withArgs(user.password, user.password)
  const done = createDoneSpy(null, false, new Error('WrongAccount'))
  await t.context.middleware(user.name, user.password, done)
  verifyMockCalls(t, done)
})

test('Local login throws error', async (t) => {
  t.context.Model.getByName.throws(new Error('Error')).once().withArgs(user.name)
  t.context.Model.comparePassword.never()
  const done = createDoneSpy(null, false, new Error('Error'))
  await t.context.middleware(user.name, user.password, done)
  verifyMockCalls(t, done)
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

