
const {test, sinon, Util} = require('../../infrastructure')
const createController = require('../../../backend/components/note/controller')
const createModel = require('../../../backend/components/note/model')
const Response = require('../../../backend/base/response')

test.beforeEach(prepareTest)

const req = {
  user: {
    _id: 'asdflksjdlfkjsld',
    name: 'username'
  },
  params: {
    id: 'akjdsfhaksjdhkasd'
  }
}

const note = {
  user: req.user._id,
  _id: 'akjdsfhaksjdhkasd',
  title: 'title',
  body: 'body'
}

test('Get all notes form logged user', async (t) => {
  t.context.Model.findAll.returns([]).once().withArgs(req.user._id)
  await t.context.Controller.get(req)
  t.truthy(t.context.Response.sendData.withArgs(undefined, {notes: []}))
  t.truthy(t.context.Model.findAll.verify())
})

test('Get existing note from logged user', async (t) => {
  t.context.Model.findByID.returns(note).once().withArgs(note.user, req.params.id)
  await t.context.Controller.getNote(req)
  t.truthy(t.context.Response.sendData.withArgs(undefined, {note}))
  t.truthy(t.context.Model.findByID.verify())
})

test('Get unknown note from logged user', async (t) => {
  t.context.Model.findByID.returns(null).once().withArgs(note.user, req.params.id)
  await t.context.Controller.getNote(req)
  t.truthy(t.context.Response.sendData.withArgs(undefined, {note: null}))
  t.truthy(t.context.Model.findByID.verify())
})

// test('Create note that pass validation', async (t) => {
//   t.context.Model.create.once(req.user._id)
// })

function prepareTest (t) {
  t.context.Model = createModel({})
  t.context.Model.findAll = sinon.mock()
  t.context.Model.findByID = sinon.mock()
  t.context.Model.create = sinon.mock()
  t.context.Response = Util.deepAssign({}, Response, {
    sendOK: sinon.spy(),
    sendData: sinon.spy(),
    sendError: sinon.spy()
  })
  t.context.Controller = createController(t.context.Model, t.context.Response)
}
