
const {test, expect, sinon, Errors, Util} = require('../../../test/infrastructure')
const createModel = require('./model')

test.beforeEach(setGlobals)

test('Get all notes', async t => {
  const {findAll, Model} = createSimpleMock('findAll')
  const args = createUsernameArgs(t)
  const returnValue = []
  findAll.returns(Promise.resolve(returnValue)).withArgs(args)

  const result = await Model.getAll(t.context.user.name)

  expect(result).to.deep.equal(returnValue)
  Util.verifyMocks(findAll)
})

test('Get all notes throws error', async t => {
  const {findAll, Model} = createSimpleMock('findAll')
  const args = createUsernameArgs(t)
  const error = Errors.simple
  let result
  findAll.throws(error).withArgs(args)

  try {
    result = await Model.getAll(t.context.user.name)
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.deep.equal(error)
    expect(result).to.equal(undefined)
  }
  Util.verifyMocks(findAll)
})

test('Get By Id', async t => {
  const {findOne, Model} = createSimpleMock('findOne')
  const args = createUserAndIdArgs(t)
  const returnValue = t.context.note
  findOne.returns(t.context.note).withArgs(args)

  const result = await Model.getByID(
    t.context.user.name,
    t.context.note.id)

  expect(result).to.deep.equal(t.context.note)
  Util.verifyMocks(findOne)
})

test('Get by Id throws error', async t => {
  const {findOne, Model} = createSimpleMock('findOne')
  const args = createUserAndIdArgs(t)
  const error = Errors.simple
  findOne.throws(error).withArgs(args)
  let result

  try {
    result = await Model.getByID(t.context.user.name, t.context.note.id)
  } catch (returnedError) {
    expect(returnedError).to.deep.equal(error)
    expect(result).to.equal(undefined)
  }
  Util.verifyMocks(findOne)
})

test('Create note', async t => {
  const {create, Model} = createSimpleMock('create')
  const body = {new: true, id: '12341234', title: 'Note mock title'}
  const processedNote = Object.assign({}, body)
  delete processedNote.id
  processedNote.fk_user = t.context.user.name
  const note = createNote(t)
  create.returns(Promise.resolve(note)).withArgs(processedNote)

  const result = await Model.createOrUpdate(t.context.user.name, body)
  
  expect(result).to.deep.equal(note)
  Util.verifyMocks(create)
})

test('Update note', async t => {
  const {upsert, Model} = createSimpleMock('upsert')
  const note = createNote(t)
  upsert.returns(Promise.resolve(note)).withArgs(note)

  const result = await Model.createOrUpdate(t.context.user.name, note)

  expect(result).to.deep.equal(note)
  Util.verifyMocks(upsert)
})

test('Create or update throws error', async t => {
  const {upsert, Model} = createSimpleMock('upsert')
  const note = createNote(t)
  const error = Errors.simple
  upsert.throws(error).withArgs(note)
  let result

  try {
    result = await Model.createOrUpdate(
      t.context.user.name,
      note
    )
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.deep.equal(error)
    expect(result).to.equal(undefined)
  }
  Util.verifyMocks(upsert)
})

test('Remove note', async t => {
  const {destroy, Model} = createSimpleMock('destroy')
  const args = createUserAndIdArgs(t)
  destroy.returns(Promise.resolve()).withArgs(args)

  await Model.remove(t.context.user.name, t.context.note.id)

  Util.verifyMocks(destroy)
})

test('Remove note throws error', async t => {
  const {destroy, Model} = createSimpleMock('destroy')
  const args = createUserAndIdArgs(t)
  const error = Errors.simple
  destroy.throws(error).withArgs(args)

  try {
    await Model.remove(t.context.user.name, t.context.note.id)
    t.fail()
  } catch (returnedError) {
    expect(returnedError).to.deep.equal(error)
  }
  Util.verifyMocks(destroy)
})

function createUsernameArgs (t) {
  return {where: {
    fk_user: t.context.user.name
  }}
}

function createUserAndIdArgs (t) {
  return {where: {
    fk_user: t.context.user.name,
    id: t.context.note.id
  }}
}

function createBody (t) {
  return Object.assign({}, t.context.note, {
    fk_user: t.context.user.name
  })
}

function createNote (t) {
  return Object.assign({}, createBody(t), {
    id: t.context.noteID
  })
}

function createSimpleMock (name) {
  const mock = sinon.mock()
  const Schema = { [name]: mock }
  const Model = createModel(Schema)
  return {
    [name]: mock,
    Model
  }
}

function setGlobals (t) {
  t.context.user = {
    name: 'username'
  }
  t.context.note = {
    title: 'note mock'
  }
  t.context.noteID = 'asdf872393ds'
}

