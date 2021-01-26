import { EventBus } from "@/bus/bus";

export default {
    data() {
        return {
            gapi: null,
        }
    },
    methods: {
        processInput(input, gapi, duration = 75) {
            this.gapi = gapi;
            let intent = input.intents[0].name;
            let entities = input.entities;
            let trait = input.traits;
            // User's intention is to add only one class
            if (intent === 'single_class_event') {
                this.processSingeClassEvent(entities, gapi)
            }

            // User's intention is to create a recurring course schedule
            else if (intent === 'course_schedule') {
                this.processCourseSchedule(entities, duration)
            }

            // User's intention is to add a work due event to the calendar
            else if (intent === 'work_due') {
                this.processWorkDue(entities, trait)
            }

            // User's intention to cancel event(s)
            else if (intent === 'event_cancel') {
                this.processEventCancel(entities)
            }
        },
        /**
         * Processes one-off class event creation operations
         * @param {Object} entities All the entities processed by the nlp
         */
        processSingeClassEvent(entities) {
            EventBus.$emit("adding-event")
            let eventDetails = {};
            let courseName = entities['course_name:course_name'][0].body.toUpperCase()
            courseName = courseName.replace(/ /g, "")
            if (entities['wit$datetime:datetime']) {
                eventDetails.start = new Date(entities['wit$datetime:datetime'][0].value);
                eventDetails.end = new Date(entities['wit$datetime:datetime'][0].value);
            } else {
                eventDetails.start = new Date(entities['wit$datetime:from'][0].value);
                eventDetails.end = new Date(entities['wit$datetime:from'][0].value);
            }
            eventDetails.end.setHours(eventDetails.start.getHours() + 1)
            eventDetails.end.setMinutes(eventDetails.start.getMinutes() + 15)
            eventDetails.summary = `${courseName} - Lecture`
            eventDetails.description = `${courseName} lecture added to calendar by Skéj.\nEvent ID: skej#${eventDetails.courseName}/${Math.floor(Math.random() * 10001)}`
            eventDetails.start = { dateTime: eventDetails.start, timeZone: 'America/New_York' }
            eventDetails.end = { dateTime: eventDetails.end, timeZone: 'America/New_York' }
            this.gapi.client.calendar.events.insert({ calendarId: this.$store.state.calendarId }, JSON.stringify(eventDetails)).then((ev) => {
                EventBus.$emit("added-event", ev)
            }).catch((err) => {
                EventBus.$emit("failed-event", err)
            })
        },
        /**
         * Processes creating recurring class event operation for an entire semester
         * @param {Object} entities All the entities processed by the nlp
         */
        processCourseSchedule(entities, duration) {
            EventBus.$emit("adding-event")
            let days = []
            let eventDetails = {};
            let courseName = entities['course_name:course_name'][0].body.toUpperCase()
            courseName = courseName.replace(/ /g, "")
            entities['days:days'].forEach(day => {
                days += day.value
            })
            let daysArray = this.getDays(days)
            let rRule = this.convertToRRule(daysArray)
            let startDate = this.getStartDate(entities['time:time'][0].value, daysArray)
            eventDetails.start = startDate
            eventDetails.end = new Date(startDate);
            eventDetails.end.setHours(eventDetails.start.getHours() + Math.floor(duration / 60))
            eventDetails.end.setMinutes(eventDetails.start.getMinutes() + duration % 60)
            eventDetails.summary = `${courseName} - Lecture`
            eventDetails.description = `Recurring ${courseName} lecture added to calendar by Skéj.\n Event ID: skej#${eventDetails.courseName}/${Math.floor(Math.random() * 10001)}`
            eventDetails.recurrence = [rRule];
            eventDetails.start = { dateTime: eventDetails.start, timeZone: 'America/New_York' }
            eventDetails.end = { dateTime: eventDetails.end, timeZone: 'America/New_York' }
            this.gapi.client.calendar.events.insert({ calendarId: this.$store.state.calendarId }, JSON.stringify(eventDetails)).then((ev) => {
                EventBus.$emit("added-event", ev)
            }).catch((err) => {
                EventBus.$emit("failed-event", err)
            })
        },
        /**
         * Processes work due event creation, work (assignment, hw, lab, research paper etc.) and exam
         * @param {Object} entities All the entities processed by the nlp
         * @param {Object} trait Trait of the input sentence processed by the nlp
         */
        processWorkDue(entities, trait) {
            EventBus.$emit("adding-event")
            let eventDetails = {};
            let courseName = entities['course_name:course_name'][0].body.toUpperCase();
            courseName = courseName.replace(/ /g, "")
            if (entities['wit$datetime:datetime'][0].type === 'value') {
                eventDetails.start = new Date(entities['wit$datetime:datetime'][0].value);
                eventDetails.end = new Date(entities['wit$datetime:datetime'][0].value);
            } else if (entities['wit$datetime:datetime'][0].type === 'interval') {
                eventDetails.start = new Date(entities['wit$datetime:datetime'][0].to.value);
                eventDetails.end = new Date(entities['wit$datetime:datetime'][0].to.value);
            }
            if (entities['event:work']) { // Event type is work
                eventDetails.type = entities['event:work'][0].value;
            } else if (entities['event:exam']) { // Event type is exam
                eventDetails.type = entities['event:exam'][0].value;
            }
            eventDetails.type = this.capitalize(eventDetails.type);
            if (trait.priority[0].value === 'normal') { // Normal priority work
                if (entities['event:iteration']) {
                    eventDetails.summary = `${courseName} - ${eventDetails.type} ${entities['event:iteration'][0].body}`;
                } else {
                    eventDetails.summary = `${courseName} - ${eventDetails.type}`;
                }
            } else if (trait.priority[0].value === 'high') { // High priority work
                eventDetails.summary = `[!] ${courseName} - ${eventDetails.type}`;
            }
            eventDetails.description = `${eventDetails.summary} added to calendar by Skéj. \n`;
            eventDetails.start = { dateTime: eventDetails.start, timeZone: 'America/New_York' }
            eventDetails.end = { dateTime: eventDetails.end, timeZone: 'America/New_York' }
            this.gapi.client.calendar.events.insert({ calendarId: this.$store.state.calendarId }, JSON.stringify(eventDetails)).then((ev) => {
                EventBus.$emit("added-event", ev)
            }).catch((err) => {
                EventBus.$emit("failed-event", err)
            })
        },
        /**
         * Processes event cancel operations
         * @param {Object} entities All the entities processed by the nlp
         */
        processEventCancel(entities) {
            EventBus.$emit("deleting-events")
            let eventType;
            if (entities['event:class']) {
                eventType = 'Lecture'
            } else if (entities['event:work']) {
                eventType = this.capitalize(entities['event:work'][0].value);
            } else if (entities['event:exam']) {
                eventType = this.capitalize(entities['event:exam'][0].value);
            }
            // If course name is all multiple events are going to be deleted, sometimes there maybe no course name but event type only e.g "I don't have any classes on Monday"
            if (entities['course_name:all']) {
                if (entities['wit$datetime:datetime']) {
                    if (eventType) { // If event type is specified only delete those specific events in the day
                        this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId, q: eventType }).then((list) => {
                            list = list.result.items.filter(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:datetime'][0].value).toDateString())
                            list.forEach((event, i) => {
                                this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                                    if (i === list.length - 1) {
                                        EventBus.$emit("deleted-events")
                                    }
                                }).catch(err => console.log(err))
                            });
                        })
                    } else { // If event type is not specified delete all events in the day
                        this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId }).then((list) => {
                            list = list.result.items.filter(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:datetime'][0].value).toDateString())
                            list.forEach((event, i) => {
                                this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                                    if (i === list.length - 1) {
                                        EventBus.$emit("deleted-events")
                                    }
                                }).catch(err => console.log(err))
                            });
                        })
                    }
                } else { // Unfortunately this extra if-else block is necessary because of how AI the responds sometimes
                    if (eventType) { // If event type is specified only delete those specific events in the day
                        this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId, q: eventType }).then((list) => {
                            list = list.result.items.filter(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:from'][0].value).toDateString())
                            list.forEach((event, i) => {
                                this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                                    if (i === list.length - 1) {
                                        EventBus.$emit("deleted-events")
                                    }
                                }).catch(err => console.log(err))
                            });
                        })
                    } else { // If event type is not specified delete all events in the day
                        this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId }).then((list) => {
                            list = list.result.items.filter(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:from'][0].value).toDateString())
                            list.forEach((event, i) => {
                                this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                                    if (i === list.length - 1) {
                                        EventBus.$emit("deleted-events")
                                    }
                                }).catch(err => console.log(err))
                            });
                        })
                    }
                }
            } else { // Delete a single specific event
                if (entities['wit$datetime:datetime']) {
                    this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId, q: `${entities['course_name:course_name'][0].value.replace(/ /g,"")} - ${eventType}` }).then((list) => {
                        let event = list.result.items.find(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:datetime'][0].value).toDateString())
                        this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                            EventBus.$emit("deleted-events")
                        }).catch(err => console.log(err))
                    })
                } else if (entities['wit$datetime:from']) {
                    this.gapi.client.calendar.events.list({ calendarId: this.$store.state.calendarId, q: `${entities['course_name:course_name'][0].value.replace(/ /g,"")} - ${eventType}` }).then((list) => {
                        let event = list.result.items.find(event => new Date(event.start.dateTime).toDateString() === new Date(entities['wit$datetime:from'][0].value).toDateString())
                        this.gapi.client.calendar.events.delete({ calendarId: this.$store.state.calendarId, eventId: event.id }).then(() => {
                            EventBus.$emit("deleted-events")
                        }).catch(err => console.log(err))
                    })
                }
            }
        },
        /**
         * Figures out the earliest date this event will occur next
         * @param {String} input time string input
         * @param {Array} daysArray An array containing all the days in the week the event will occur
         */
        getStartDate(input, daysArray) {
            if (input == '') return null;

            var time = input.match(/(\d+)(:(\d\d))?\s*(p?)/i);
            if (time == null) return null;

            var hours = parseInt(time[1], 10);
            if (hours == 12 && !time[4]) {
                hours = 0;
            } else {
                hours += (hours < 12 && time[4]) ? 12 : 0;
            }
            let startDate = new Date();
            startDate.setHours(hours);
            startDate.setMinutes(parseInt(time[3], 10) || 0);
            startDate.setSeconds(0, 0);
            startDate.setDate(startDate.getDate() + ((7 - startDate.getDay()) % 7 + this.getDay(daysArray[0]) + 1) % 7);
            return startDate;
        },
        /**
         * Generates a recurrence rule string based off the schedule. Recurrence occurs until CUNY's last day of semester
         * @param {Array} daysArray An array containing all the days in the week the event will occur
         * REMINDER: Month index starts at 0. So January = 0, March = 2 etc.
         */
        convertToRRule(daysArray) {
            let recurrence = 'RRULE:FREQ=WEEKLY;BYDAY='
            for (let i = 0; i < daysArray.length - 1; i++) {
                const day = daysArray[i];
                recurrence += `${day},`
            }
            recurrence += daysArray[daysArray.length - 1]
            let currentDate = new Date();
            let untilDate;
            if (currentDate.getMonth() <= 4) {
                untilDate = new Date(Date.UTC(currentDate.getFullYear(), 4, 21, 0, 0))
            } else if (currentDate.getMonth() > 4 && currentDate.getMonth() <= 7) {
                untilDate = new Date(Date.UTC(currentDate.getFullYear(), 7, 21, 0, 0))
            } else if (currentDate.getMonth() > 7 && currentDate.getMonth() <= 11) {
                untilDate = new Date(Date.UTC(currentDate.getFullYear(), 11, 21, 11, 0, 0))
            }
            untilDate = `${untilDate.toISOString()}`.replace(/-/g, "").replace(/:/g, "").replace(/\.000/g, "")
            recurrence += `;UNTIL=${untilDate}`
            return recurrence;
        },
        /**
         * Returns the same string back with first character capitalized
         * @param {String} string A word
         */
        capitalize(string) {
            if (typeof string !== 'string') return ''
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
        /**
         * Returns the index number of a given day of the week
         * @param {String} day Uppercase first two initials of the first day of the event's recurring schedule
         */
        getDay(day) {
            switch (day) {
                case 'SU':
                    return 6
                case 'MO':
                    return 0
                case 'TU':
                    return 1
                case 'WE':
                    return 2
                case 'TH':
                    return 3
                case 'FR':
                    return 4
                case 'SA':
                    return 5
                default:
                    return null;
            }
        },
        /**
         * Creates an ordered array of all the days the recurring event will occur, necessary for creating the recurrence rule
         * @param {String} input Concatenated string of all the days found in the user's input
         */
        getDays(input) {
            input = input.toUpperCase()
            let daysArray = []
            input = input.toUpperCase()
            if (input.includes('MON')) {
                daysArray.push('MO')
            }
            if (input.includes('TUE')) {
                daysArray.push('TU')
            }
            if (input.includes('WED')) {
                daysArray.push('WE')
            }
            if (input.includes('THU')) {
                daysArray.push('TH')
            }
            if (input.includes('FRI')) {
                daysArray.push('FR')
            }
            if (input.includes('SAT')) {
                daysArray.push('SA')
            }
            if (input.includes('SUN')) {
                daysArray.push('SU')
            }
            return daysArray;
        }
    },
}