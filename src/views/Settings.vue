<template>
  <div id="optionsModal">
    <div id="section">
      <div id="title">
        <h2>Semester</h2>
        <i class="fas fa-redo" v-on:click="resetDates"></i>
      </div>
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
      <div id="row">
        <div id="left">
          <h3>Class Duration</h3>
          <p>General length of most classes</p>
        </div>
        <div id="right">
          <input
            type="text"
            name="classDuration"
            id="classDuration"
            class="input-text"
            placeholder="e.g 90 minutes"
            v-model="duration"
          />
        </div>
      </div>
    </div>
    <div id="section" class="purple">
      <div id="title">
        <h2>College</h2>
        <p>Details to put into event description</p>
      </div>
      <div id="row">
        <div id="left">
          <h3>Name</h3>
          <p>Name of your college</p>
        </div>
        <div id="right">
          <input
            type="text"
            name="collegeName"
            id="collegeName"
            class="input-text"
            v-model="collegeName"
          />
        </div>
      </div>
      <div id="row">
        <div id="left">
          <h3>Address</h3>
          <p>Address for your college</p>
        </div>
        <div id="right">
          <input
            type="text"
            name="collegeAddress"
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
export default {
  name: "Settings",
  data() {
    return {
      startDate: "2021-01-29",
      endDate: "2021-05-22",
      collegeName: this.$store.state.settings.collegeName,
      collegeAddress: this.$store.state.settings.collegeAddress,
      duration: this.$store.state.settings.duration,
    };
  },
  methods: {
    resetDates() {
      this.startDate = "2021-01-29";
      this.endDate = "2021-05-22";
    },
  },
  watch: {
    startDate(current) {
      this.$store.commit("updateStartDate", current);
    },
    endDate(current) {
      this.$store.commit("updateEndDate", current);
    },
    collegeName(current) {
      this.$store.commit("updateCollegeName", current);
    },
    collegeAddress(current) {
      this.$store.commit("updateCollegeAddress", current);
    },
    duration(current) {
      this.$store.commit("updateDuration", current);
    },
  },
  created() {
    this.startDate = this.$store.state.settings.startDate;
    this.endDate = this.$store.state.settings.endDate;
    this.collegeName = this.$store.state.settings.collegeName;
    this.collegeAddress = this.$store.state.settings.collegeAddress;
    this.duration = this.$store.state.settings.duration;
  },
};
</script>