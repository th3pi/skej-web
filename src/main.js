import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueGapi from 'vue-gapi'
import store from './store'
import axios from 'axios'
import VueModal from '@kouts/vue-modal'
import VueyeDatePicker from 'vueye-datepicker'
import VueComp from '@vue/composition-api';

import '@kouts/vue-modal/dist/vue-modal.css'
import 'animate.css'
Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.component('modal', VueModal)
Vue.component('date-picker', VueyeDatePicker)
Vue.use(VueComp);
Vue.use(VueGapi, {
    apiKey: 'AIzaSyATghl56GUu9COQZNcyFwO9GBT4d5nHoUE',
    clientId: '1062921622932-6mu3ob420nln816uihukl0m9jh5vol5n.apps.googleusercontent.com',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar',
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')