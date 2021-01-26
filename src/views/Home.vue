<template>
  <div>
    <div id="nav" v-if="authStatus">
      <a
        id="settingsButton"
        v-on:click="showOptions = true"
        class="pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft"
        >Settings</a
      >
      ·
      <a
        id="settingsButton"
        v-on:click="logout"
        class="pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft"
        >Logout</a
      >
    </div>
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
      <input
        id="sendButton"
        class="button"
        type="button"
        v-on:click="sendButtonAction"
        :value="sendButtonText"
        disabled
      />
    </div>
    <div id="google_oauth">
      <!-- Authentication and User feedback button -->
      <!-- If user is not logged in -->
      <fade-transition mode="out-in" :duration="200">
        <input
          id="authButton"
          name="authButton"
          class="button"
          type="button"
          :value="authButtonText"
          v-on:click="authButtonAction"
        />
      </fade-transition>

      <!-- Logout button -->
      <a
        id="faqButton"
        v-on:click="showFaq = true"
        class="pwa-element pwa-borders-borderBottom-easeInFromLeft-easeOutToLeft"
        >What can I say?</a
      >
    </div>
    <modal
      v-model="showFaq"
      title="Here's how to use Skéj"
      inClass="animate__animated animate__backInRight animate__faster"
      outClass="animate__animated animate__backOutRight animate__faster"
    >
      <faq />
    </modal>
    <modal
      v-model="showOptions"
      title="Settings (settings are saved automatically)"
      inClass="animate__animated animate__backInRight animate__faster"
      outClass="animate__animated animate__backOutRight animate__faster"
    >
      <settings />
    </modal>
  </div>
</template>

<script>
import input_processor from "@/mixins/input_processor.js";
import { EventBus } from "@/bus/bus";
import { FadeTransition } from "vue2-transitions";
import Faq from "./Faq.vue";
import Settings from "./Settings.vue";
export default {
  name: "Home",
  components: { FadeTransition, Faq, Settings },
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
     * Logs out user
     */
    logout() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.auth2.getAuthInstance().signOut();
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
      EventBus.$on("logout", () => {
        this.status = "notLoggedIn";
        this.$store.commit("clearStorage");
        this.authStatus = false;
      });
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
