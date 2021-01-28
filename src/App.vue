<template>
  <div id="app">
    <transition
      enter-active-class="animate__animated animate__backInRight animate__faster"
      leave-active-class="animate__animated animate__backOutRight animate__faster"
    >
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showOptions: false,
      showFaq: false,
      authenticated: null,
    };
  },
  methods: {},
  watch: {},
  created() {
    document.title = "Skéj";
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

// #nav a.router-link-exact-active {
//   color: #42b983;
// }
</style>