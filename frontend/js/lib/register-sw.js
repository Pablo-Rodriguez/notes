
export default () => {
  if ('serviceWorker' in window.navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch((err) => console.log('Error registering SW', err))
  }
}

