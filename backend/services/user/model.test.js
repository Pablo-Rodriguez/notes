
const Sequelize = require('sequelize')

const {test, expect, sinon, Errors, Util} = require('../../../test/infrastructure')
const Bcrypt = require('../../lib/bcrypt')
const UserSchema = require('./schema')
const createModel = require('./model')

test('Get by name returns a user', async t => {
  const {findOne, user, args, Model} = createGetByNameTestFixtures()
  findOne.returns(Promise.resolve(user)).withArgs(args)

  const returnedUser = await Model.getByName(user.name)

  expect(returnedUser).to.deep.equal(user)
  Util.verifyMocks(findOne)
})

test('Get by name returns null', async t => {
  const {findOne, user, args, Model} = createGetByNameTestFixtures()
  findOne.returns(Promise.resolve(null)).withArgs(args)

  const returnedUser = await Model.getByName(user.name)

  expect(returnedUser).to.equal(null)
  Util.verifyMocks(findOne)
})

test('Create a valid user', async t => {
  const {create, user, Model} = createCreateTestFixtures()
  create.returns(Promise.resolve(user)).withArgs(user)
  
  const result = await Model.create(user)

  expect(result).to.deep.equal(user)
  Util.verifyMocks(create)
})

test('Create a user that does not pass validation', async t => {
  const {create, user, Model} = createCreateTestFixtures()
  const error = new Sequelize.ValidationError()
  const message = 'validation error message'
  error.errors = [{path: 'name', value: user.name, message}]

  create.throws(error).withArgs(user)
  let result

  try {
    result = await Model.create(user)
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.equal(error)
    expect(returnedError.errors).to.deep.equal([{
      message,
      field: 'name'
    }])
    expect(result).to.equal(undefined)
  }
  Util.verifyMocks(create)
})

test('Create a user that does not pass primary key constraint', async t => {
  const {create, user, Model} = createCreateTestFixtures()
  const error = new Sequelize.UniqueConstraintError()
  const message = UserSchema.PRIMARY_KEY_ERROR
  error.errors = [{
    path: 'PRIMARY',
    value: user.name,
    message
  }]

  create.throws(error).withArgs(user)
  let result

  try {
    result = await Model.create(user)
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.equal(error)
    expect(returnedError.errors).to.deep.equal([{
      message,
      field: 'name'
    }])
  }
  Util.verifyMocks(create)
})

test('Create user throws error', async t => {
  const {create, user, Model} = createCreateTestFixtures()
  const error = Errors.simple
  let result
  create.throws(error).withArgs(user)

  try {
    result = await Model.create(user)
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.deep.equal(error)
    expect(returnedError.errors).to.equal(undefined)
  }
  Util.verifyMocks(create)
})

test('Compare correct password', async t => {
  const {Model, password} = createComparePasswordTextFixtures()
  const guess = 'password'
  const result = await Model.comparePassword(guess, password)
  expect(result).to.equal(true)
})

test('Compare incorrect password', async t => {
  const {Model, password} = createComparePasswordTextFixtures()
  const guess = 'wrongPassword'
  const result = await Model.comparePassword(guess, password)
  expect(result).to.equal(false)
})

function createGetByNameTestFixtures () {
  const findOne = sinon.mock()
  const user = { id: 'f89238foaef8ya3', name: 'username' }
  const args = { where: { name: user.name } }
  const Model = createModel({findOne}, {Bcrypt})
  return {findOne, user, args, Model}
}

function createComparePasswordTextFixtures () {
  const Model = createModel({}, {Bcrypt})
  const password = '$2a$10$Ssesuy9Ga7UseUddvRAej.Nqj1S3HlDX4Yc.EK2PXY/aTT.gAgaAe'
  return {Model, password}
}

function createCreateTestFixtures () {
  const create = sinon.mock()
  const user = {
    name: 'username',
    password: 'password',
    fullname: 'fullname'
  }
  const Model = createModel({create}, {Bcrypt})
  return {create, user, Model}
}
