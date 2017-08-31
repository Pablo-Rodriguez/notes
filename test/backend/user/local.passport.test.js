
const {test, sinon} = require('../../infrastructure')
const createModel = require('../../../backend/components/user/model')
const Local = require('../../../backend/lib/passport/local')

test.beforeEach(prepareTest)

const user = {
  name: 'name',
  password: 'password'
}

test('Local login => valid user and password', async (t) => {
  prepareMocks(t, user, user.name, Promise.resolve(true))
  const done = await execAndReturnSpy(t, user)
  checkResultsAndDoneArgs(t, done, null, user)
})

test('Local login => wrong username', async (t) => {
  prepareMocks(t, null)
  const done = await execAndReturnSpy(t, user)
  checkResultsAndDoneArgs(t, done, null, false)
  checkErrors(t, done)
})

test('Local login => wrong password', async (t) => {
  prepareMocks(t, user, user.name, Promise.resolve(false))
  const done = await execAndReturnSpy(t, user)
  checkResultsAndDoneArgs(t, done, null, false)
  checkErrors(t, done)
})

function checkErrors (t, done) {
  t.truthy(done.args[0][2] instanceof Error)
  t.is(done.args[0][2].message, 'Wrong Account')
}

function prepareMocks (t, user, query, bcryptResult) {
  t.context.Model.getByName.returns(user).calledWith(query)
  t.context.Bcrypt.compare.returns(bcryptResult)
}

function checkResultsAndDoneArgs (t, done, ...args) {
  t.truthy(t.context.Model.getByName.verify())
  t.truthy(done.calledOnce)
  t.truthy(done.calledWith(...args))
}

async function execAndReturnSpy (t, user) {
  const spy = sinon.spy()
  await t.context.middleware(user.name, user.password, spy)
  return spy
}

function prepareTest (t) {
  t.context.Model = createModel({})
  t.context.Model.getByName = sinon.mock()
  t.context.Bcrypt = {
    compare: sinon.mock()
  }
  t.context.middleware = Local.strategy(t.context.Model, t.context.Bcrypt)
}
