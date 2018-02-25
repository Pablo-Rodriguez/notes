
const {test, sinon, Util, Errors} = require('../../infrastructure')
const createController = require('../../../backend/services/note/controller')
const Response = require('../../../backend/base/response')

test.beforeEach(prepareTest)

const note = {
  id: 1,
  title: 'title',
  body: 'body',
  fk_user: 'username',
  tags: []
}

const req = {
  user: {
    _id: 'asdflksjdlfkjsld',
    name: 'username',
    notes: [note]
  },
  params: {
    id: 'akjdsfhaksjdhkasd'
  }
}

const res = {is: 'response mock object'}

test('Get all notes form logged user', async (t) => {
  t.context.Model.getAll.returns([]).once().withArgs(req.user.name)
  await t.context.Controller.getAll(req, res)
  t.truthy(t.context.Response.sendData.calledWith(res, {notes: []}))
  t.truthy(t.context.Model.getAll.verify())
})

test('Get all notes throws error', async (t) => {
  t.context.Model.getAll.throws(new Error('error')).once().withArgs(req.user.name)
  await t.context.Controller.getAll(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
  t.truthy(t.context.Model.getAll.verify())
})

test('Get existing note from logged user', async (t) => {
  t.context.Model.getByID.returns(note).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.getNote(req, res)
  t.truthy(t.context.Response.sendData.calledWith(res, {note}))
  t.truthy(t.context.Model.getByID.verify())
})

test('Get unknown note from logged user', async (t) => {
  t.context.Model.getByID.returns(null).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.getNote(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.NOT_FOUND))
  t.truthy(t.context.Model.getByID.verify())
})

test('Get note throws error', async (t) => {
  t.context.Model.getByID.throws(new Error('error')).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.getNote(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
  t.truthy(t.context.Model.getByID.verify())
})

test('Create/update note that pass validation', async (t) => {
  const note = {title: '', body: ''}
  t.context.Model.createOrUpdate.once().withArgs(req.user.name, note)
  await t.context.Controller.createOrUpdate(Object.assign({body: note}, req), res)
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(t.context.Model.createOrUpdate.verify())
})

test('Create/update note that does not pass validation', async (t) => {
  t.context.Model.createOrUpdate.throws(Errors.SEQUELIZE_VALIDATION).once().withArgs(req.user.name, note)
  await t.context.Controller.createOrUpdate(Object.assign({body: note}, req), res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.CUSTOM_BAD_REQUEST({fields: []})))
  t.truthy(t.context.Model.createOrUpdate.verify())
})

test('Create/update throws error', async (t) => {
  t.context.Model.createOrUpdate.throws(new Error('error')).once().withArgs(req.user.name, note)
  await t.context.Controller.createOrUpdate(Object.assign({body: note}, req), res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
  t.truthy(t.context.Model.createOrUpdate.verify())
})

test('Delete existing note', async (t) => {
  t.context.Model.delete.returns(Promise.resolve(1)).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.delete(req, res)
  t.truthy(t.context.Response.sendOK.calledWith(res))
  t.truthy(t.context.Model.delete.verify())
})

test('Delete unknown note', async (t) => {
  t.context.Model.delete.returns(Promise.resolve(0)).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.delete(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.NOT_FOUND))
  t.truthy(t.context.Model.delete.verify())
})

test('Delete note throws error', async (t) => {
  t.context.Model.delete.throws(new Error('error')).once().withArgs(req.user.name, req.params.id)
  await t.context.Controller.delete(req, res)
  t.truthy(t.context.Response.sendError.calledWith(res, Response.SERVER_ERROR))
  t.truthy(t.context.Model.delete.verify())
})

function prepareTest (t) {
  t.context.Model = {
    getAll: sinon.mock(),
    getByID: sinon.mock(),
    createOrUpdate: sinon.mock(),
    delete: sinon.mock()
  }
  t.context.Response = Util.deepAssign({}, Response, {
    sendOK: sinon.spy(),
    sendData: sinon.spy(),
    sendError: sinon.spy(),
    CUSTOM_BAD_REQUEST: Response.CUSTOM_BAD_REQUEST,
    handleValidationErrors: Response.handleValidationErrors
  })
  t.context.Controller = createController(t.context.Model, t.context.Response)
}
