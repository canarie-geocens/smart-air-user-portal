// toast notification plugin
import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted)

const duration = 5
const toastType = ['success', 'info', 'error']
// register customize global toast totifications .
for (let i in toastType) {
  // options to the toast
  let toastOptions = {
    type: toastType[i],
    theme: 'bubble',
    position: 'top-right',
    duration: duration * 1000,
  }

  Vue.toasted.register(
    toastType[i] + 'Message',
    (payload) => {
      // if there is no message passed show default message
      if (!payload.message) {
        return 'Oops.. Something Went Wrong..'
      }

      // if there is a message show it with the message
      return payload.message
    },
    toastOptions
  )
}
