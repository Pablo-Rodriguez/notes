
export default ({api, handlers, uuid, util}) => (state, bus) => {
  const {notes} = state
  const types = state.events.notes
  
  bus.on(state.events.user.LOGGED_IN, () => {
    bus.emit(types.FETCH_NOTES)
  })

  bus.on(types.FETCH_NOTES, async () => {
    try {
      let localNotes = window.localStorage.getItem('notes')
      if (localNotes != null) {
        localNotes = JSON.parse(localNotes).notes
      } else {
        window.localStorage.setItem('notes', JSON.stringify({notes: []}))
        localNotes = []
      }
      notes.data = localNotes
      const response = await api.fetch()
      const serverNotes = response.data.notes
      notes.data.forEach((note) => {
        const serverNote = serverNotes.find(serverNote => serverNote.id === note.id)
        const isNew = serverNote == null
        if (isNew) {
          note.new = true
          note.sync = false
        } else {
          note.new = false
          const isMoreRecent = serverNote.updatedAt < note.updatedAt
          if (!isMoreRecent) {
            note.sync = false
          } else {
            note.sync = true
            Object.assign(note, serverNote)
          }
        }
      })
      serverNotes
        .filter((serverNote) => {
          return notes.data.find(note => note.id === serverNote.id) == null
        })
        .forEach((note) => {
          note.sync = true
          note.new = false
          notes.data.push(note)
        })
      notes.data.filter(note => !note.sync).forEach(note => bus.emit(types.SAVE_NOTE, note))
      bus.emit(state.events.RENDER)
    } catch (error) {
      console.log('Error fetching notes from server')
      console.log(error)
    }
  })

  bus.on(types.ADD_NOTE, () => {
    const note = {
      sync: false,
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: uuid(),
      new: true
    }
    notes.data.unshift(note)
    notes.selected = note
    bus.emit(types.SAVE_NOTE, note)
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

  bus.on(types.DELETE_NOTE, async () => {
    const note = notes.selected
    if (note != null) {
      const id = note.id
      try {
        await api.delete(id)
        note.deleted = true
        notes.data = notes.data.filter(note => !note.deleted)
        notes.selected = null
      } catch (error) {
        console.log(`Error deleting note with id ${id}`)
      }
      const storedNotes = JSON.parse(window.localStorage.getItem('notes'))
      const storedNote = storedNotes.notes.find(storedNote => storedNote.id === id)
      if (storedNote != null) {
        storedNote.toBeDeleted = true
        storedNotes.notes = storedNotes.notes.filter(note => !note.toBeDeleted)
      }
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
    const notes = JSON.parse(localStorage.getItem('notes'))
    const id = note.new ? note.id : null
    try {
      note.updatedAt = new Date().toISOString()
      const response = await api.save(note)
      Object.assign(note, response.data)
      note.new = false
      note.sync = true
    } catch (error) {
    
    }
    const storedNote = notes.notes.find(storedNote => storedNote.id === note.id || storedNote.id === id)
    if (storedNote != null) {
      storedNote.toBeDeleted = true
      notes.notes = notes.notes.filter(note => !note.toBeDeleted)
    }
    notes.notes.push(note)
    localStorage.setItem('notes', JSON.stringify(notes))
    bus.emit(state.events.RENDER)
  })
}

