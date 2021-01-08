import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        calendarId: null,
        user: {
            name: String,
            email: String,
        },
        inputs: ['I have a CS355 class on Monday at 11pm', 'I have a CS355 class on Wednesday at 11pm', 'I have a CS355 class on Wednesday at 1pm'],
    },
    mutations: {
        saveCalendar(state, calendarId) {
            state.calendarId = calendarId;
        },
        saveUser(state, { name, email }) {
            state.user.name = name;
            state.user.email = email;
        },
        clearStorage(state) {
            state.calendarId = null
            state.user.name = null
            state.user.email = null
        },
        addInput(state, input) {
            state.inputs.push(input);
        }
    },
    actions: {},
    modules: {}
})