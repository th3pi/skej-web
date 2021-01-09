<template>
  <div id="app">
    <router-view />
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
  created() {},
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
  left: 0;
  right: 0;
  margin: 0 auto;
}

#nav a {
  font-weight: bold;
  color: var(--dark-blue);
  margin: 5px 10px;
  cursor: pointer;
  transition: 0.3s;
}

#nav a:hover {
  opacity: 0.85;
}

#nav a.modal-active {
  color: var(--purple);
}

// #nav a.router-link-exact-active {
//   color: #42b983;
// }
</style>