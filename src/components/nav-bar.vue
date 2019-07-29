<template>
  <ul :class="$style.container">
    <nav-bar-routes :routes="persistentNavRoutes" />
    <nav-bar-routes v-if="loggedIn" :routes="loggedInNavRoutes" />
    <nav-bar-routes v-else :routes="loggedOutNavRoutes" />
  </ul>
</template>

<script>
import NavBarRoutes from './nav-bar-routes'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      persistentNavRoutes: [
        {
          name: 'home',
          title: 'Home',
        },
      ],
    }
  },
}
</script>

<style lang="scss" module>
@import '@design';

.container {
  padding: 0;
  margin: 0 0 $size-grid-padding;
  text-align: center;
  list-style-type: none;

  > li {
    display: inline-block;
    margin-right: $size-grid-padding;
  }
}
</style>
