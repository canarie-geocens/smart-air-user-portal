import Vue from 'vue'
import App from './app'
import router from '@router'
import store from '@state/store'
import '@/src/components/base/_globals'
import '@/src/components/base/_toasts'
// bootstrap
import BootstrapVue from 'bootstrap-vue'
// mapbox
import 'mapbox-gl'
// multiselect
import Multiselect from 'vue-multiselect'
// moment
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
// an event bus
import VueBus from 'vue-bus'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import VeeValidate from 'vee-validate'

import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

Vue.use(VeeValidate, {
  fieldsBagName: 'vvFields',
})
Vue.component('v-slider', VueSlider)
Vue.component('loading', Loading)

Vue.use(VueBus)

Vue.use(BootstrapVue)

Vue.use(VueMoment, {
  moment,
})

Vue.use(flatPickr)

Vue.component('multiselect', Multiselect)

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (window.Cypress) {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

// If running inside Cypress...
if (window.Cypress) {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
