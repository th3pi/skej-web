<template>
  <div id="app">
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
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
.animate__animated.animate__fadeIn,
.animate__animated.animate__fadeOut {
  animation-duration: 0.1s;
}
</style>