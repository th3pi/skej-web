
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://skej.bhyn.dev">
    <img src="https://i.imgur.com/fN4gNWI.png" alt="Logo" >
  </a>
  <p align="center">
    The easiest college calendar management assistant
    <br />
    <a href="https:/skej.bhyn.dev"><strong>Try out Skéj»</strong></a>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Things you can say to Skéj](#things-you-can-say-to-skéj)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
    <img src="https://i.imgur.com/dlgzUiD.png" alt="witaisc">
</p>

Skéj was built for my final CSCI355 final project submission. However, Skéj has grown a lot since then. Now with proper UI/UX, hosted on a public domain ready for everyone to use!

Skéj's specialty is that it does everything on the frontend - on the user's machine. No personal data is sent to the backend. There is no backend for Skéj. Skéj is just the middleman with a beautiful face that interacts with Wit.ai's API and Google's API to understand user input. Then create, read, update or delete events based on it. The natural language processing model is specifically trained to understand college course lingo in great details.

### Built With
Skéj was primarily built using Node.js and only Node.js for the project submission but the public and complete version of Skéj implements Vue.js for a robust front-end.
* [Vue.js](https://vuejs.org/)
* [Google API Client Library for JavaScript](https://github.com/google/google-api-javascript-client)
* [Wit.ai](https://wit.ai/)
* [Node.js](https://nodejs.org/en/)



<!-- GETTING STARTED -->
## Getting Started

Since Skéj is open-source. You're free to run it locally on your machine. However, that does require some configuration.

### Prerequisites

This is a list of things you need to have downloaded and set up before you can run Skéj.
* [Node.js](https://nodejs.org/en/)
* npm
```sh
npm install npm@latest -g
```
* vue-cli
```
npm install -g @vue/cli
```
* [Google Calendar API Key and ClientID](https://console.developers.google.com/apis/library/calendar-json.googleapis.com)

<p align="center">
    <img src="https://i.imgur.com/vqsOxFh.png" alt="witaisc">
</p>

* [Wit.ai API Key](https://wit.ai/)
<p align="center">
    <img src="https://i.imgur.com/1nbbiJh.png" alt="witaisc">
</p>

### Installation

1. Clone the repo 
```sh
git clone https://github.com/th3pi/skej-web.git
```
2. Create `api_keys.js` file in `skej-web/src/` using the snippet below and add the required keys and ids replacing the blank fields
```js
module.exports = {
    gapi: 'GOOGLE_API_KEY_HERE',
    gClientId: 'GOOGLE_APP_CLIENT_ID_HERE',
    wit: 'Bearer WIT_AI_CLIENT_ACCESS_TOKEN_HERE',
}
```

**NOTE:** Here's what `api_key.js` should look like.
<p align="center">
    <img src="https://i.imgur.com/9bOQNwA.png" alt="witaisc">
</p>


3. Install npm packages
```sh
npm install
```
4. Run the program
```sh
npm run serve
```
<p align="center">
    <img src="https://i.imgur.com/7qa8OY7.png" alt="witaisc">
</p>

<!-- USAGE EXAMPLES -->
## Things you can say to Skéj

Here are some examples of things Skéj is trained to understand at the moment.

#### Recurring semester events
- I have CS 370 class on saturdays and sundays at 2pm
- CS323 class at 2:30pm on Tuesdays and Thursdays
- I have CSCI340 class on Mondays and Wednesdays at 10:45pm
- I have ARCH 240 class on tuesdays and sundays at 10:00am
- I have ACT 101 class on mondays and fridays at 10:55pm
- CSCI316 class 5pm Mondays and Wednesdays
- I have CS355 class on Tuesdays, Thursdays and Fridays at 9pm

#### Non-recurring one-off events

- CS340 class last thursday of this month at 1pm
- I have a ART10 class on Monday at 6pm
- I have a CS355 class on Wednesday at 6pm
- I have a CMLIT101W class on Tuesday at 5:30pm
- I have a CS 323 class last Monday of this month at 3:55pm
- PSCI101W quiz on Sunday 11pm
- I have MATH240 assignment that is due on the first of January at 8pm
- I need to submit MATH240 assignment that is due on the first of January at 8pm
- I have to submit CSCI 370 assignment 1 due by next Monday
- I have ART50 quiz on december 29
- FNES101 homework by second sunday of this month
- i have a cs323 research paper due next monday
- I have a CS340 exam on Tuesday at 9pm
- I have CS323 exam 2 6pm on 1/8

#### Removing events from calendar

- My CS 343 class on thursday was cancelled
- cs120 assignmnt on wednesday canceled
- My CMLIT101W paper on Friday was cancelled
- My CS355 class on tuesday was cancelled
- My ASTR100 exam on friday was cancelled
- My CS355 class on the 17th was cancelled
- I dont have ART200 class on friday
- My ASTR101 class on 12/15 was cancelled
- My cs340 exam on Tuesday was cancelled
- I don't have anything on friday
- I don't have any classes on friday
- I don't have anything due on 12/17

<!-- ROADMAP -->
## Roadmap

Skéj is far from complete. Below is a roadmap for all the features that I intend Skéj to be updated with over the span of 2021.
- [ ] Moving an event from one date/time to another (Rescheduling)
- [ ] Account profiles with cloud backup to save and sync user settings across all devices
- [ ] More robust NLP model


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. However Skéj is a **deeply personal project**, so public contributions are not allowed. If you have any suggestions please feel free to create an issue or email me at tanjim@bhyn.dev.

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Tanjimul Bhuiyan - Twitter: [@tanjim_b](https://twitter.com/tanjim_b) - Email: tanjim@bhyn.dev

Project Link: [https://github.com/th3pi/skej-web](https://github.com/th3pi/skej-web)
