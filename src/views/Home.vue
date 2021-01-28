<template>
  <div id="home">
    <div id="mainBody">
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
          v-on:keyup.enter="sendButtonAction"
          v-on:keydown.up="getPrevInput"
          v-on:keydown.down="getNextInput"
        />

        <!-- Send button sends processes user input -->
        <!-- Displayed Submit button by default. Changes based context  -->
        <button
          id="sendButton"
          class="button"
          type="button"
          v-on:click="sendButtonAction"
          :value="sendButtonText"
          disabled
        >
          Submit
        </button>
      </div>
      <div id="google_oauth">
        <!-- Authentication and User feedback button -->
        <!-- If user is not logged in -->
        <fade-transition mode="out-in" :duration="200">
          <button
            id="authButton"
            name="authButton"
            class="button"
            type="button"
            v-on:click="authButtonAction"
          >
            {{ authButtonText }}
          </button>
        </fade-transition>
        <strong v-if="authStatus">|</strong>
        <a
          style="margin: 0 5px"
          @click="$router.push({ name: 'Settings' }).catch(() => {})"
          v-if="authStatus"
          >Settings</a
        >
        <strong v-if="authStatus">|</strong>
        <!-- FAQ button -->
        <a
          id="faqButton"
          v-if="authStatus"
          v-on:click="$modal.show('faq')"
          style="margin-left: 5px"
          >What can I say?</a
        >
      </div>
      <modal name="faq" height="auto" :adaptive="true">
        <faq />
      </modal>
    </div>
  </div>
</template>

<script>
import input_processor from "@/mixins/input_processor.js";
import { EventBus } from "@/bus/bus";
import { FadeTransition } from "vue2-transitions";
import Faq from "./Faq.vue";
export default {
  name: "Home",
  components: { FadeTransition, Faq },
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
      qCursor: this.$store.state.inputs.length, // Cursor to indicate index of current input
      showOptions: false,
      showFaq: false,
      authenticated: false,
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
        gapi.auth2.getAuthInstance().isSignedIn.listen((res) => {
          if (res) {
            this.fetchCollegeCalendar(gapi);
            this.status = "loggedIn";
            this.authStatus = true;
          } else {
            this.status = "notLoggedIn";
            this.authStatus = false;
          }
        });
      });
    },

    /**
     * Gets the secondary college calendar id from user's Google Calendar Account
     * Creates a College calendar if it doesn't exist already
     */
    fetchCollegeCalendar(gapi) {
      gapi.client.calendar.calendarList.list().execute((event) => {
        let collegeName = this.$store.state.settings.collegeName;
        if (collegeName === "") collegeName = "College";
        if (event.items.find((el) => el.summary === collegeName)) {
          this.$store.commit(
            "saveCalendar",
            event.items.find((el) => el.summary === collegeName).id
          );
        } else {
          gapi.client.calendar.calendars
            .insert({ summary: collegeName })
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
          Authorization: this.$wit,
        },
      }).then((res) => {
        this.$store.commit("addInput", this.q);
        this.qCursor = this.$store.state.inputs.length;
        this.$gapi.getGapiClient().then((gapi) => {
          this.processInput(
            res.data,
            gapi,
            this.$store.state.settings.duration === ""
              ? 75
              : this.$store.state.settings.duration
          );
        });
      });
    },
    /**
     * Event listeners and handlers
     */
    eventListeners() {
      EventBus.$on("adding-event", () => {
        this.status = "adding";
      });
      EventBus.$on("deleting-events", () => {
        this.status = "deleting";
      });
      EventBus.$on("deleted-events", () => {
        this.status = "deleted";
      });
      EventBus.$on("added-event", (data) => {
        if (data.result.status === "confirmed") {
          this.status = "added";
          this.eventLink = data.result.htmlLink;
        } else {
          this.status = "addFailed";
          this.authButtonText = "Oops, that didn't work";
        }
      });
      EventBus.$on("copy-sample", (data) => (this.q = data));
    },
    /**
     * Opens event on Google Calendar in a new tab
     */
    openEvent() {
      window.open(this.eventLink);
    },
    /**
     * Clears the input field
     */
    clear() {
      this.q = "";
    },
    sendButtonAction() {},
    authButtonAction() {},
    /**
     * Updates UI elements to show loading messages
     */
    wait(message) {
      let authButton = document.getElementById("authButton");
      let sendButton = document.getElementById("sendButton");
      let q = document.getElementById("q");
      this.authButtonText = message;
      this.authButtonAction = function () {};
      this.sendButtonAction = function () {};
      sendButton.setAttribute("disabled", true);
      q.setAttribute("disabled", true);
      authButton.className = "button button-working";
    },
    /**
     * Updates UI elements after a process is complete
     */
    done(
      message,
      authButtonClass,
      sendButtonMessage,
      sendButtonAction,
      sendButtonDisabled = false
    ) {
      let authButton = document.getElementById("authButton");
      let sendButton = document.getElementById("sendButton");
      let q = document.getElementById("q");
      if (sendButtonDisabled === false) {
        sendButton.removeAttribute("disabled");
      }
      q.removeAttribute("disabled");
      this.authButtonText = message;
      this.sendButtonText = sendButtonMessage;
      this.sendButtonAction = sendButtonAction;
      q.focus();
      authButton.className = authButtonClass;
    },
    /**
     * Gets previous input
     */
    getPrevInput() {
      if (this.qCursor > 0) {
        this.qCursor--;
        this.q = this.$store.state.inputs[this.qCursor];
      } else {
        this.status = "reachedFirst";
      }
    },
    /**
     * Gets next input
     */
    getNextInput() {
      if (this.qCursor < this.$store.state.inputs.length - 1) {
        this.qCursor++;
        this.q = this.$store.state.inputs[this.qCursor];
      } else {
        this.status = "reachedLast";
      }
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
        this.authStatus = true;
        this.eventLink = null;
        this.done(
          "Connected",
          "button button-success",
          "Submit",
          this.sendMessage,
          true
        );
      } else if (current === "notLoggedIn") {
        this.authButtonText = "Login with Google Calendar";
        this.authStatus = false;
        authButton.className = "button";
        this.authButtonAction = this.login;
      } else if (current === "added") {
        this.done(
          "Added!",
          "button button-success",
          "Open Event",
          this.openEvent
        );
      } else if (current === "working") {
        this.wait("Working...");
      } else if (current === "adding") {
        this.wait("Updating calendar...");
      } else if (current === "addFailed") {
        this.done(
          "Oops, that didn't work",
          "button button-error",
          "Clear",
          this.clear
        );
      } else if (current === "deleting") {
        this.wait("Removing events...");
      } else if (current === "deleted") {
        this.done(
          "Removed events!",
          "button button-success",
          "Clear",
          this.clear
        );
      } else if (current === "reachedFirst") {
        this.done(
          "That's the first thing you said",
          "button button-error",
          this.sendButtonText,
          this.sendButtonAction
        );
      } else if (current === "reachedLast") {
        this.done(
          "That's the last thing you said",
          "button button-error",
          this.sendButtonText,
          this.sendButtonAction
        );
      } else if (current === null) {
        this.authButtonText = "Checking...";
        authButton.className = "button";
      }
    },
    q(current) {
      let sendButton = document.getElementById("sendButton");
      if (current.length < 10) {
        sendButton.setAttribute("disabled", true);
      } else {
        sendButton.removeAttribute("disabled");
      }
      // If an event was added and user makes changes to the user input, app status resets to allow user to submit another input
      if (this.status !== "loggedIn") {
        this.status = "loggedIn";
      }
    },
    showFaq(current) {
      if (current) {
        document.getElementById("faqButton").className =
          "pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft modal-active";
      } else {
        document.getElementById("faqButton").className =
          "pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft";
      }
    },
    showOptions(current) {
      if (current) {
        document.getElementById("settingsButton").className =
          "pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft modal-active";
      } else {
        document.getElementById("settingsButton").className =
          "pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft";
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
    this.eventListeners();
  },
};
</script>
