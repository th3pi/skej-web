<template>
  <div>
    <div id="logo">SKÉJ</div>
    <p>Advanced schedule management tool</p>
    <div class="form">
      <input
        id="q"
        class="text-box"
        name="q"
        type="text"
        placeholder="Ex: I have a CS340 class at 5:40pm on Fridays and Saturdays"
        v-model="q"
      />
      <input
        id="sendButton"
        class="button"
        type="button"
        v-on:click="sendMessage"
        :value="sendButtonText"
        :disabled="!qStatus"
      />
    </div>
    <div id="google_oauth">
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-if="status === 'notLoggedIn'"
        v-on:click="login"
        value="Login with Google Calendar"
      />
      <input
        id="authButton"
        name="authButton"
        class="button button-success"
        type="button"
        v-else-if="status === 'loggedIn'"
        value="Connected"
      />
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-else-if="status === null"
        value="Checking..."
      />
      <input
        id="authButton"
        name="authButton"
        class="button"
        type="button"
        v-else-if="status === 'loginFailed'"
        :value="authButtonText"
        v-on:click="login"
      />

      <input
        id="logoutButton"
        v-if="status === 'loggedIn'"
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
export default {
  name: "Home",
  components: {},
  mixins: [input_processor],
  data() {
    return {
      status: null,
      authButtonText: "Checking...",
      q: "",
      qStatus: false,
      sendButtonText: "Submit",
    };
  },
  methods: {
    login() {
      this.$gapi.getGapiClient().then((gapi) => {
        this.gapi = gapi;
        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then((event) => {
            this.$store.commit("saveUser", event.wt.fV, event.wt.cu);
            this.status = "loggedIn";
          })
          .catch((error) => {
            this.status = "loginFailed";
            if (error.error === "popup_closed_by_user") {
              this.authButtonText = "Login canceled";
              setTimeout(() => {
                this.authButtonText = "Login with Google Calendar";
              }, 5000);
            }
          });
      });
    },
    logout() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.auth2.getAuthInstance().signOut();
        this.status = "notLoggedIn";
        this.$store.commit("clearStorage");
      });
    },
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
        //TODO: FINISH SEMND MESSAGE

        console.log(this.processInput(res.data));
      });
    },
  },
  watch: {
    status(current) {
      let authButton = document.getElementById("authButton");
      if (current === "loggedIn") {
        document.title = "Skéj - Connected";
        this.authButtonText = "Connected";
      } else if (current === "notLoggedIn") {
        this.authButtonText = "Log in with Google Calendar";
        authButton.className = "button";
      }
    },
    q(current) {
      if (current.length < 10) {
        this.qStatus = false;
      } else {
        this.qStatus = true;
      }
    },
  },
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
