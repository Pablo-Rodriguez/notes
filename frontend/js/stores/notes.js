
export default ({api, handlers, uuid, util}) => (state, bus) => {
  const {notes} = state
  const types = state.events.notes

  bus.on(types.ADD_NOTE, () => {
    const note = {
      sync: false,
      title: '',
      body: '',
      date: Date.now(),
      id: uuid()
    }
    notes.data.unshift(note)
    notes.selected = note
    bus.emit(state.events.RENDER)
  })

  bus.on(types.SELECT_NOTE, (noteID) => {
    notes.selected = notes.data.find(note => note.id === noteID)
    bus.emit(state.events.RENDER)
  })

  bus.on(types.NOTE_CHANGE, (note) => {
    Object.assign(notes.selected, note)
    bus.emit(state.events.RENDER)
  })

  bus.on(types.CHANGE_VIEW, () => {
    notes.preview = !notes.preview
    bus.emit(state.events.RENDER)
  })

  bus.on(types.DELETE_NOTE, () => {
    const note = notes.selected
    if (note != null) {
      note.deleted = true
      notes.data = notes.data.filter(note => !note.deleted)
      notes.selected = null
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

  bus.on(types.SAVE_NOTE, () => {
    // TODO
    console.log('save')
  })
}

