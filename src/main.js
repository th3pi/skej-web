import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueGapi from 'vue-gapi'
import store from './store'
import axios from 'axios'
import VueModal from '@kouts/vue-modal'
import api from './api_keys'

import '@kouts/vue-modal/dist/vue-modal.css'
import 'animate.css'
Vue.prototype.$http = axios;
Vue.prototype.$wit = api.wit;
Vue.config.productionTip = false
Vue.component('modal', VueModal)
Vue.use(VueGapi, {
    apiKey: api.gapi,
    clientId: api.gClientId,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar',
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')