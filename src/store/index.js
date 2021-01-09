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
        inputs: [],
        settings: {
            startDate: "2021-01-29",
            endDate: "2021-05-22",
            collegeName: "",
            collegeAddress: "",
            duration: "",
        }
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
        },
        updateStartDate(state, startDate) {
            state.settings.startDate = startDate;
        },
        updateEndDate(state, endDate) {
            state.settings.endDate = endDate;
        },
        updateCollegeName(state, collegeName) {
            state.settings.collegeName = collegeName;
        },
        updateCollegeAddress(state, collegeAddress) {
            state.settings.collegeAddress = collegeAddress;
        },
        updateDuration(state, duration) {
            state.settings.duration = duration;
        }
    },
    actions: {},
    modules: {}
})