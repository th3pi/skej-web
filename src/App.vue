<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <a v-on:click="showOptions = true">About</a>
    </div>
    <router-view />
    <modal
      v-model="showOptions"
      title="Options"
      inClass="animate__animated animate__backInRight animate__faster"
      outClass="animate__animated animate__backOutRight animate__faster"
    >
      <h2>Semester</h2>
      <h3>Start Date</h3>
      <p>
        Setting semester <strong>start date</strong> determines the first day of
        classes Skéj will use setup your calendar for the semester
      </p>
      <date-picker
        v-model="startDate"
        format="mm/dd/yyyy"
        color="#011936"
      ></date-picker>
      <br />
      <h3>End Date</h3>
      <p>
        Setting semester <strong>end date</strong> date determines the first day
        of classes Skéj will use setup your calendar for the semester
      </p>
      <date-picker
        v-model="endDate"
        format="mm/dd/yyyy"
        color="#011936"
      ></date-picker>
      <h1>Hello</h1>
    </modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showOptions: true,
      startDate: {
        value: new Date("01/29/2021"),
        formattedValue: "",
      },
      endDate: {
        value: new Date("05/22/2021"),
        formattedValue: "",
      },
    };
  },
};
</script>
<style lang="scss">
@import "assets/styles/style.scss";
@import "assets/styles/sunset.min.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

#nav {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 15px;
  margin-right: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.vm {
  border-radius: 10px;
}
</style>
