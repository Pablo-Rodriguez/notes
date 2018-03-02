
const {test, expect, sinon, Util, Errors} = require('../../../test/infrastructure')
const Response = require('../../base/response')
const createController = require('./controller')

test.beforeEach(setGlobals)
test.beforeEach(prepareTest)

test('Get all notes form logged user', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getAll.returns([]).withArgs(req.user.name)
  await Controller.getAll(req, res)
  expect(Response.sendData).to.have.been.calledWith(res, {notes: []})
  Util.verifyMocks(Model.getAll)
})

test('Get all notes throws error', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getAll.throws(Errors.simple).withArgs(req.user.name)
  await Controller.getAll(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.getAll)
})

test('Get existing note from logged user', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByID.returns(req.body).withArgs(req.user.name, req.params.id)
  await Controller.getNote(req, res)
  expect(Response.sendData).to.have.been.calledWith(res, {note: req.body})
  Util.verifyMocks(Model.getByID)
})

test('Get unknown note from logged user', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByID.returns(null).withArgs(req.user.name, req.params.id)
  await Controller.getNote(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.NOT_FOUND)
  Util.verifyMocks(Model.getByID)
})

test('Get note throws error', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.getByID.throws(Errors.simple).withArgs(req.user.name, req.params.id)
  await Controller.getNote(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.getByID)
})

test('Create/update note that pass validation', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  const note = {title: '', body: ''}
  Model.createOrUpdate.withArgs(req.user.name, note)
  await Controller.createOrUpdate(Object.assign({}, req, {body: note}), res)
  expect(Response.sendOK).to.have.been.calledWith(res)
  Util.verifyMocks(Model.createOrUpdate)
})

test('Create/update note that does not pass validation', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.createOrUpdate.throws(Errors.SEQUELIZE_VALIDATION)
    .withArgs(req.user.name, req.body)
  await Controller.createOrUpdate(req, res)
  expect(Response.sendError).to.have.been
    .calledWith(res, Response.CUSTOM_BAD_REQUEST({fields: []}))
  Util.verifyMocks(Model.createOrUpdate)
})

test('Create/update throws error', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.createOrUpdate.throws(Errors.simple).withArgs(req.user.name, req.body)
  await Controller.createOrUpdate(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.createOrUpdate)
})

test('Delete existing note', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.delete.returns(Promise.resolve(1)).withArgs(req.user.name, req.params.id)
  await Controller.delete(req, res)
  expect(Response.sendOK).to.have.been.calledWith(res)
  Util.verifyMocks(Model.delete)
})

test('Delete unknown note', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.delete.returns(Promise.resolve(0)).withArgs(req.user.name, req.params.id)
  await Controller.delete(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.NOT_FOUND)
  Util.verifyMocks(Model.delete)
})

test('Delete note throws error', async (t) => {
  const {Controller, Model, Response, req, res} = t.context
  Model.delete.throws(new Error('error')).withArgs(req.user.name, req.params.id)
  await Controller.delete(req, res)
  expect(Response.sendError).to.have.been.calledWith(res, Response.SERVER_ERROR)
  Util.verifyMocks(Model.delete)
})

function prepareTest (t) {
  t.context.Model = {
    getAll: sinon.mock(),
    getByID: sinon.mock(),
    createOrUpdate: sinon.mock(),
    delete: sinon.mock()
  }
  t.context.Response = Util.mockResponse(Response)
  t.context.Controller = createController(t.context.Model, t.context.Response)
}

function setGlobals (t) {
  t.context.note = {
    id: 1,
    title: 'title',
    body: 'body',
    fk_user: 'username',
    tags: []
  }

  t.context.req = {
    body: t.context.note,
    user: {
      _id: 'asdflksjdlfkjsld',
      name: 'username',
      notes: [t.context.note]
    },
    params: {
      id: 'akjdsfhaksjdhkasd'
    }
  }

  t.context.res = {is: 'response mock object'}
}
