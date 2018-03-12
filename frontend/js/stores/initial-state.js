
import faker from 'faker/locale/es'

export default {
  user: {
    data: null,
    error: null,
    loading: false,
    logged: null
  },
  notes: {
    data: createFakeNotes(),
    selected: null,
    preview: false,
    filter: ''
  }
}

function createFakeNotes () {
  const notes = []
  for (let i = 0; i < 10; i++) {
    const note = {
      title: faker.random.words(),
      id: String(i),
      date: Date.now(),
      body: faker.lorem.paragraphs()
    }
    notes.push(note)
  }
  return notes
}

