<template>
  <div id="optionsModal">
    <div id="section">
      <div id="title">
        <h2>Setting up your schedule</h2>
        <p>Click on an example to copy</p>
      </div>
      <div id="row">
        <div id="left">
          <h4>Adding weekly classes</h4>
          <p>
            Adds recurring weekly classes to the calendar from starting to end
            of semester
          </p>
        </div>
        <div id="right">
          <p v-on:click="copySample(0)">
            {{ samples[0] }}
          </p>
        </div>
      </div>
      <div id="row">
        <div id="left">
          <h4>Adding a single class</h4>
          <p>Adds one non-recurring single class event to the calendar</p>
        </div>
        <div id="right">
          <p v-on:click="copySample(1)">{{ samples[1] }}</p>
        </div>
      </div>
      <div id="row">
        <div id="left">
          <h4>Adding a special event</h4>
          <p>
            Special one-off events like quiz, midterm, exam, assignment, report,
            paper etc.
          </p>
        </div>
        <div id="right">
          <p v-on:click="copySample(2)">
            I have a CS323 <strong>assignment</strong> due by next Friday 5pm
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from "@/bus/bus";

export default {
  name: "Faq",
  data() {
    return {
      samples: [
        "I have CS343 class on Monday and Wednesdays at 10:45am",
        "I have a CMLIT101W class on Tuesday at 5:30pm",
        "I have a CS323 assignment due by next Friday 5pm",
      ],
    };
  },
  methods: {
    copySample(i) {
      EventBus.$emit("copy-sample", this.samples[i]);
    },
  },
};
</script>

<style lang="scss">
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  #optionsModal {
    h2 {
      font-size: 1.5rem;
    }
    #row {
      grid-template-columns: 100%;
      grid-template-rows: min-content;
      grid-template-areas:
        "left"
        "left"
        "right"
        "right"
        "right";
    }
    #left,
    #right {
      p {
        margin: 5px;
      }
    }
  }
}
</style>