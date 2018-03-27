
import Service from '../services/notes'

export default ({api, handlers, uuid, util}) => (state, bus) => {
  const {notes} = state
  const types = state.events.notes
  const service = new Service(state, bus, uuid)
  
  bus.on(state.events.user.LOGGED_IN, () => {
    bus.emit(types.FETCH_NOTES)
  })

  bus.on(types.FETCH_NOTES, async () => {
    try {
      let localNotes = service.loadLocalNotes().notes
      notes.data = localNotes
      const response = await api.fetch()
      const serverNotes = response.data.notes
      notes.data = service.mergeNotes(notes.data, serverNotes)
      service.resaveUnsyncedNotes(notes.data)
      service.saveLocalNotes({notes: notes.data})
      bus.emit(state.events.RENDER)
    } catch (error) {
      console.log('Error fetching notes from server')
      console.log(error)
    }
  })

  bus.on(types.ADD_NOTE, () => {
    const note = service.createNote()
    notes.data.unshift(note)
    notes.selected = note
    bus.emit(types.SAVE_NOTE, note)
  })

  bus.on(types.SELECT_NOTE, (noteID) => {
    notes.selected = service.findById(notes.data, noteID)
    bus.emit(state.events.RENDER)
  })

  bus.on(types.NOTE_CHANGE, (note) => {
    Object.assign(notes.selected, note)
    notes.selected.saved = false
    notes.selected.sync = false
    bus.emit(state.events.RENDER)
  })

  bus.on(types.CHANGE_VIEW, () => {
    notes.preview = !notes.preview
    bus.emit(state.events.RENDER)
  })

  bus.on(types.DELETE_NOTE, async () => {
    const note = notes.selected
    if (note != null) {
      const id = note.id
      notes.selected = null
      try {
        await api.delete(id)
      } catch (error) {
        console.log(`Error deleting note with id ${id}`)
      }
      notes.data = service.removeFromLocal(notes.data, id)
      const storedNotes = service.loadLocalNotes()
      storedNotes.notes = service.removeFromLocal(storedNotes.notes, id)
      service.saveLocalNotes(storedNotes)
      window.localStorage.setItem('notes', JSON.stringify(storedNotes))
      bus.emit(state.events.RENDER)
    }
  })

  bus.on(types.EXPORT_NOTES, () => {
    util.downloadAsJSON({notes: state.notes.data}, 'notes')
  })

  bus.on(types.FILTER_CHANGE, (value = '') => {
    notes.filter = value
    bus.emit(state.events.RENDER)
  })

  bus.on(types.SAVE_NOTE, async (note = state.notes.selected) => {
    const notes = service.loadLocalNotes()
    const id = note.new ? note.id : null
    try {
      note.updatedAt = new Date().toISOString()
      const response = await api.save(note)
      Object.assign(note, response.data)
      note.new = false
      note.sync = true
    } catch (error) {}
    notes.notes = service.removeFromLocal(notes.notes, id)
    notes.notes = service.removeFromLocal(notes.notes, note.id)
    notes.notes.push(note)
    service.saveLocalNotes(notes)
    note.saved = true
    bus.emit(state.events.RENDER)
  })
}

