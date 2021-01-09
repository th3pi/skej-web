<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <a v-on:click="showFaq = true">What can I say?</a>
      <a v-on:click="showOptions = true">Settings</a>
    </div>
    <router-view />
    <modal
      v-model="showFaq"
      title="Here's how to use Skéj"
      inClass="animate__animated animate__backInRight animate__faster"
      outClass="animate__animated animate__backOutRight animate__faster"
    >
      <div id="optionsModal">
        <div id="section">
          <div id="title">
            <h2>Setting up your schedule</h2>
          </div>
          <div id="row">
            <div id="left">
              <h4>Adding weekly classes</h4>
            </div>
            <div id="right"></div>
          </div>
          <div id="row">
            <div id="left">
              <h4>Adding a single class</h4>
            </div>
            <div id="right"></div>
          </div>
          <div id="row">
            <div id="left">
              <h4>Adding a special event</h4>
              <p>
                Special one-off events like quiz, midterm, exam, assignment,
                report, paper etc.
              </p>
            </div>
            <div id="right"></div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      v-model="showOptions"
      title="Settings"
      inClass="animate__animated animate__backInRight animate__faster"
      outClass="animate__animated animate__backOutRight animate__faster"
    >
      <div id="optionsModal">
        <div id="section">
          <div id="title">
            <h2>Semester</h2>
            <i class="fas fa-redo" v-on:click="resetDates"></i>
          </div>
          <div id="row">
            <div id="left">
              <h3>Start Date</h3>
              <p>
                The <strong>first day</strong> classes can be scheduled from
              </p>
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
              <p>
                The <strong>last day</strong> classes can be scheduled up to
              </p>
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
              />
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showOptions: false,
      showFaq: true,
      startDate: "2021-01-29",
      endDate: "2021-05-22",
    };
  },
  methods: {
    resetDates() {
      this.startDate = "2021-01-29";
      this.endDate = "2021-05-22";
    },
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
.vm-content {
  padding: 0 !important;
}
#optionsModal {
  #section {
    padding: 10px 0;
    background-color: rgba(11, 121, 255, 0.25);
  }
  #datePicker {
    font-family: "Roboto", sans-serif;
    border-radius: 10px;
    border-width: 0;
    box-shadow: 12px 12px 16px 0 var(--shadow),
      -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
    color: var(--dark-blue);
    width: 100%;
    padding-right: 5px;
    outline: none;
  }
  ::-webkit-datetime-edit-text {
    color: var(--light-blue);
    padding: 0 0.3em;
  }
  // ::-webkit-datetime-edit-month-field {
  //   color: var(--dark-blue);
  // }
  // ::-webkit-datetime-edit-year-field {
  //   color: var(--dark-blue);
  // }
  // ::-webkit-datetime-edit-fields-wrapper {
  // background: silver;
  // }
  ::-webkit-datetime-edit {
    padding: 1em;
  }
  #title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    margin: 0;
    color: var(--light-blue);
    i {
      transition: transform 0.4s;
      cursor: pointer;
    }
    i:hover {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
    p {
      font-size: 0.75rem;
    }
  }
  #row {
    display: grid;
    grid-template-columns: 20% 20% 15% 15% 15% 15%;
    grid-template-rows: auto;
    grid-template-areas: "left left right right right right";
    #left {
      grid-area: left;
      h3,
      h4 {
        margin: 10px 0 0 10px;
        color: var(--light-blue);
      }
      p {
        margin: 5px 0 10px 10px;
        font-size: 0.85rem;
        color: var(--light-blue);
        opacity: 0.65;
      }
    }
    #right {
      align-self: center;
      grid-area: right;
      margin: 5px 15px 0 15px;
      p {
        padding: 5px 0 0 0;
      }
    }
  }
  #section.purple {
    background-color: rgba(245, 31, 120, 0.25);
  }
  .purple {
    #title {
      color: var(--purple);
    }
    #row {
      #left {
        h3,
        p {
          color: var(--purple);
        }
      }
    }
  }
  .input-text {
    height: 80%;
    width: 100%;
    margin: 5px 5px;
    box-shadow: 12px 12px 16px 0 var(--shadow),
      -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    border-width: 0;
    padding: 1rem;
    color: var(--dark-blue);
    outline: none;
  }
}
</style>