<template>
  <div id="app">
    <transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
      mode="out-in"
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
</style>