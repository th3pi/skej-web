<template>
  <div>
    <div id="logo">SKÉJ</div>
    <p>Easy schedule management tool</p>
    <div class="form">
      <!-- User input text box -->
      <input
        id="q"
        class="text-box"
        name="q"
        type="text"
        placeholder="Ex: I have a CS340 class at 5:40pm on Fridays and Saturdays"
        v-model="q"
      />

      <!-- Send button sends processes user input -->
      <!-- Displayed Submit button by default. Changes based context  -->
      <input
        id="sendButton"
        class="button"
        type="button"
        v-on:click="sendMessage"
        v-if="status !== 'added'"
        :value="sendButtonText"
        :disabled="!qStatus"
      />

      <!-- If event gets successfully added -->
      <input
        id="sendButton"
        class="button"
        type="button"
        v-else-if="status === 'added'"
        :value="sendButtonText"
        v-on:click="sendButtonAction"
      />
    </div>
    <div id="google_oauth">
      <!-- Authentication and User feedback button -->
      <!-- If user is not logged in -->
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-if="status === 'notLoggedIn'"
        v-on:click="login"
        value="Login with Google Calendar"
      />

      <!-- If user is logged in -->
      <input
        id="authButton"
        name="authButton"
        class="button button-success"
        type="button"
        v-else-if="status === 'loggedIn'"
        value="Connected"
      />

      <!-- If user authentication status is unknown -->
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-else-if="status === null"
        value="Checking..."
      />

      <!-- If user authentication fails -->
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-else-if="status === 'loginFailed'"
        :value="authButtonText"
        v-on:click="login"
      />

      <!-- If user event add was successful -->
      <input
        id="authButton"
        name="authButton"
        class="button button-success"
        type="button"
        v-else-if="status === 'added'"
        :value="authButtonText"
      />

      <!-- If user event add failed -->
      <input
        id="authButton"
        name="authButton"
        class="button button-error"
        type="button"
        v-else-if="status === 'addFailed'"
        :value="authButtonText"
      />

      <!-- Logout button -->
      <input
        id="logoutButton"
        v-if="authStatus"
        name="logoutButton"
        class="button text"
        type="button"
        v-on:click="logout"
        value="Disconnect"
      />
    </div>
  </div>
</template>

<script>
import input_processor from "@/mixins/input_processor.js";
import { EventBus } from "@/bus/bus";

export default {
  name: "Home",
  components: {},
  mixins: [input_processor],
  data() {
    return {
      authStatus: null, // Authentication status
      status: null, // Status of the app. Used for user feedback
      authButtonText: "Checking...", // The authentication button
      q: "", // The user input
      qStatus: false, // User input text field status
      sendButtonText: "Submit", // User input text field submit button
      eventLink: null, // Event link after it gets added to calendar
    };
  },
  methods: {
    /**
     * Logs in user
     */
    login() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then((event) => {
            this.$store.commit("saveUser", event.wt.fV, event.wt.cu);
            this.status = "loggedIn";
            this.authStatus = true;
          })
          .catch((error) => {
            this.status = "loginFailed";
            this.authStatus = false;
            if (error.error === "popup_closed_by_user") {
              this.authButtonText = "Login canceled";
              setTimeout(() => {
                this.authButtonText = "Login with Google Calendar";
              }, 5000);
            }
          });
      });
    },
    /**
     * Logs out user
     */
    logout() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.auth2.getAuthInstance().signOut();
        this.status = "notLoggedIn";
        this.$store.commit("clearStorage");
        this.authStatus = false;
      });
    },
    /**
     * Gets the secondary college calendar id from user's Google Calendar Account
     * Creates a College calendar if it doesn't exist already
     */
    fetchCollegeCalendar(gapi) {
      gapi.client.calendar.calendarList.list().execute((event) => {
        if (event.items.find((el) => el.summary === "College")) {
          this.$store.commit(
            "saveCalendar",
            event.items.find((el) => el.summary === "College").id
          );
        } else {
          gapi.client.calendar.calendars
            .insert({ summary: "College" })
            .execute((event) => {
              this.$store.commit("saveCalendar", event.id);
            });
        }
      });
    },
    /**
     * Sends the user input to work with wit.ai and then Google Calendar
     */
    sendMessage() {
      let date = `${new Date().getFullYear()}${
        new Date().getMonth() + 1
      }${new Date()
        .getDate()
        .toLocaleString(undefined, { minimumIntegerDigits: 2 })}`;
      this.$http({
        method: "GET",
        url: `https://api.wit.ai/message?q=${this.q}&v=${date}`,
        headers: {
          Authorization: "Bearer NPZBD422SPC72CZGL2ITSYJYKJC4ION6",
        },
      }).then((res) => {
        this.$gapi.getGapiClient().then((gapi) => {
          this.processInput(res.data, gapi);
          EventBus.$on("added-event", (data) => {
            if (data.result.status === "confirmed") {
              this.status = "added";
              this.eventLink = data.result.htmlLink;
            } else {
              this.status = "addFailed";
              this.authButtonText = "Oops, that didn't work";
            }
          });
        });
      });
    },
    /**
     * Opens event on Google Calendar in a new tab
     */
    openEvent() {
      window.open(this.eventLink);
    },
    clear() {
      this.q = "";
    },
    sendButtonAction() {
      this.q = "";
    },
  },
  watch: {
    /**
     * Status value watch method. Checks for current status of the app
     * And changes values dynamically for user feedback
     */
    status(current) {
      let authButton = document.getElementById("authButton");
      if (current === "loggedIn") {
        document.title = "Skéj - Connected";
        this.authButtonText = "Connected";
        this.authStatus = true;
      } else if (current === "notLoggedIn") {
        this.authButtonText = "Log in with Google Calendar";
        this.authStatus = false;
        authButton.className = "button";
      } else if (current === "added") {
        this.authButtonText = "Added!";
        this.sendButtonText = "Open Event";
        this.sendButtonAction = this.openEvent;
      } else if (current === "addFailed") {
        this.authButtonText = "Oops, that didn't work";
        this.sendButtonText = "Clear";
      }
    },
    q(current) {
      if (current.length < 10) {
        this.qStatus = false;
      } else {
        this.qStatus = true;
      }
      // If an event was added and user makes changes to the user input, app status resets to allow user to submit another input
      if (this.status === "added" || this.status === "addFailed") {
        this.status = "loggedIn";
        this.sendButtonAction = this.sendMessage;
      }
    },
  },

  /**
   * Created method gets user authentication status upon loading of the app
   */
  created() {
    this.$gapi.getGapiClient().then((gapi) => {
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        this.fetchCollegeCalendar(gapi);
        this.status = "loggedIn";
      } else {
        this.status = "notLoggedIn";
      }
    });
  },
};
</script>
