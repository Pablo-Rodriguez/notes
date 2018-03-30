
import {createListeners} from '../lib/media-queries'

export default () => (state, bus) => {
  const initialValue = createListeners((e, data) => {
    state.mediaqueries[data.name] = data.match.matches
    bus.emit(state.events.RENDER)
  })
  console.log(initialValue)
  Object.assign(state.mediaqueries, initialValue)
}

