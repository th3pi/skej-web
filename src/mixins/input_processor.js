export default {
    data() {
        return {
            gapi: null,
        }
    },
    methods: {
        processInput(input) {
            let intent = input.intents[0].name;
            let entities = input.entities;
            let trait = input.traits;

            // User's intention is to add only one class
            if (intent === 'single_class_event') {
                return this.processSingeClassEvent(entities)
            }

            // User's intention is to create a recurring course schedule
            else if (intent === 'course_schedule') {
                return this.processCourseSchedule(entities)
            }

            // User's intention is to add a work due event to the calendar
            else if (intent === 'work_due') {
                return this.processWorkDue(entities, trait)
            }

            // User's intention to cancel event(s)
            else if (intent === 'event_cancel') {
                return this.processEventCancel(entities)
            }
        },
        processSingeClassEvent(entities) {
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
            eventDetails.description = `${courseName} lecture added to calendar by Skéj.\n Event ID: skej#${eventDetails.name}/${Math.floor(Math.random() * 10001)}`
            eventDetails.start = { dateTime: eventDetails.start, timeZone: 'America/New_York' }
            eventDetails.end = { dateTime: eventDetails.end, timeZone: 'America/New_York' }

            //TODO: FINISH GAPI
            gapi.client.calendar.events.insert(eventDetails)
            return eventDetails;
        },
        processCourseSchedule(entities) {
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
            eventDetails.end.setHours(eventDetails.start.getHours() + 1)
            eventDetails.end.setMinutes(eventDetails.start.getMinutes() + 15)
            eventDetails.name = `${courseName} - Lecture`
            eventDetails.description = `Recurring ${courseName} lecture added to calendar by Skéj.\n Event ID: skej#${eventDetails.name}/${Math.floor(Math.random() * 10001)}`
            eventDetails.recurrence = rRule;
            return eventDetails
        },
        processWorkDue(entities, trait) {
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
                    eventDetails.name = `${courseName} - ${eventDetails.type} ${entities['event:iteration'][0].body}`;
                } else {
                    eventDetails.name = `${courseName} - ${eventDetails.type}`;
                }
            } else if (trait.priority[0].value === 'high') { // High priority work
                eventDetails.name = `[!] ${courseName} - ${eventDetails.type}`;
            }
            eventDetails.description = `${eventDetails.name} added to calendar by Skéj. \n`;
            return eventDetails;
        },
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
        capitalize(string) {
            if (typeof string !== 'string') return ''
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
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