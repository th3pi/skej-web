<template>
  <div id="optionsModal" v-if="$store.state.calendarId !== null">
    <div id="section">
      <div id="title">
        <h1>
          <span><i class="fas fa-cog"></i></span> Settings
        </h1>
        <!-- Display a save button if settings page is opened instead of the pop up -->
        <div id="buttons" style="display: flex; align-items: center">
          <div
            id="backButton"
            class="button"
            style="padding: 2.5px 10px"
            @click="$router.go(-1)"
          >
            <h4>
              <i class="fas fa-long-arrow-alt-left"> </i>
              {{ backButtonMessage }}
            </h4>
          </div>
          <div
            id="logoutButton"
            class="button"
            style="padding: 2.5px 10px"
            @click="logout"
          >
            <i class="fas fa-power-off"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <!-- Semester settings -->
    <div id="section">
      <div id="title">
        <h2>Semester</h2>
        <i class="fas fa-redo" v-on:click="resetDates"></i>
      </div>

      <!-- Start date settings -->
      <div id="row">
        <div id="left">
          <h3>Start Date</h3>
          <p>The <strong>first day</strong> classes can be scheduled from</p>
        </div>
        <div id="right">
          <input
            type="date"
            name="startDate"
            id="datePicker"
            v-model="startDate"
          />
        </div>
      </div>

      <!-- End date settings -->
      <div id="row">
        <div id="left">
          <h3>End Date</h3>
          <p>The <strong>last day</strong> classes can be scheduled up to</p>
        </div>
        <div id="right">
          <input
            type="date"
            name="startDate"
            id="datePicker"
            v-model="endDate"
          />
        </div>
      </div>

      <!-- Class Duration settings -->
      <div id="row">
        <div id="left">
          <h3>Class Duration</h3>
          <p>General length of most classes in minutes</p>
        </div>
        <div id="right">
          <input
            type="text"
            name="classDuration"
            id="classDuration"
            class="input-text"
            placeholder="e.g 75"
            v-model="duration"
          />
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <!-- College settings -->
    <div id="section">
      <div id="title">
        <h2>College</h2>
        <p>Details to put into event description</p>
      </div>

      <!-- Name of college -->
      <div id="row">
        <div id="left">
          <h3>Name</h3>
          <p>Name of your college</p>
        </div>
        <div id="right">
          <input
            type="text"
            id="collegeName"
            class="input-text"
            v-model="collegeName"
          />
        </div>
      </div>

      <!-- College Address -->
      <div id="row">
        <div id="left">
          <h3>Address</h3>
          <p>Address for your college</p>
        </div>
        <div id="right">
          <input
            type="text"
            id="collegeAddress"
            class="input-text"
            v-model="collegeAddress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { EventBus } from "@/bus/bus";

export default {
  name: "Settings",
  data() {
    return {
      startDate: "2021-01-29", // Default start date
      endDate: "2021-05-22", // Default end date
      collegeName: this.$store.state.settings.collegeName, // Fetch college name from local storage
      collegeAddress: this.$store.state.settings.collegeAddress, // Fetch college address from local storage
      duration: this.$store.state.settings.duration, // Fetch default duration from local storage
      openedPage: null, // Boolean flag that shows if settings page is opened or popup,
      backButtonMessage: "Go Back",
      backButtonMessageTimer: setTimeout(() => {
        this.backButtonMessage = "Go Back";
      }, 1500),
    };
  },
  methods: {
    resetDates() {
      this.startDate = "2021-01-29";
      this.endDate = "2021-05-22";
    },
    /**
     * Logs out user
     */
    logout() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.auth2.getAuthInstance().signOut();
        this.$store.commit("clearStorage");
        this.$router.replace({ name: "Home" });
      });
    },
  },
  watch: {
    // Watchers update localstorage after each keystroke
    startDate(current) {
      this.$store.commit("updateStartDate", current);
      this.backButtonMessage = "Saved!";
      document.getElementById("backButton").className = "button button-success";
      clearTimeout(this.backButtonMessageTimer);
      this.backButtonMessageTimer = setTimeout(() => {
        document.getElementById("backButton").className = "button";
        this.backButtonMessage = "Go Back";
      }, 1500);
    },
    endDate(current) {
      this.$store.commit("updateEndDate", current);
      this.backButtonMessage = "Saved!";
      document.getElementById("backButton").className = "button button-success";
      clearTimeout(this.backButtonMessageTimer);
      this.backButtonMessageTimer = setTimeout(() => {
        document.getElementById("backButton").className = "button";
        this.backButtonMessage = "Go Back";
      }, 1500);
    },
    collegeName(current) {
      this.$store.commit("updateCollegeName", current);
      this.backButtonMessage = "Saved!";
      document.getElementById("backButton").className = "button button-success";
      clearTimeout(this.backButtonMessageTimer);
      this.backButtonMessageTimer = setTimeout(() => {
        document.getElementById("backButton").className = "button";
        this.backButtonMessage = "Go Back";
      }, 1500);
    },
    collegeAddress(current) {
      this.$store.commit("updateCollegeAddress", current);
      this.backButtonMessage = "Saved!";
      document.getElementById("backButton").className = "button button-success";
      clearTimeout(this.backButtonMessageTimer);
      this.backButtonMessageTimer = setTimeout(() => {
        document.getElementById("backButton").className = "button";
        this.backButtonMessage = "Go Back";
      }, 1500);
    },
    duration(current) {
      this.$store.commit("updateDuration", current);
      this.backButtonMessage = "Saved!";
      document.getElementById("backButton").className = "button button-success";
      clearTimeout(this.backButtonMessageTimer);
      this.backButtonMessageTimer = setTimeout(() => {
        document.getElementById("backButton").className = "button";
        this.backButtonMessage = "Go Back";
      }, 1500);
    },
  },
  created() {
    this.startDate = this.$store.state.settings.startDate;
    this.endDate = this.$store.state.settings.endDate;
    this.collegeName = this.$store.state.settings.collegeName;
    this.collegeAddress = this.$store.state.settings.collegeAddress;
    this.duration = this.$store.state.settings.duration;
    if (this.$route.fullPath === "/settings") {
      this.openedPage = true;
    } else {
      this.openedPage = false;
    }
  },
  beforeMount() {
    if (this.$store.state.calendarId === null) {
      this.$router.replace({ name: "Home" });
    }
  },
};
</script>
<style lang="scss">
h2,
h3 {
  color: var(--dark-blue);
  text-shadow: none;
}
h4 {
  margin: 0;
}
</style>