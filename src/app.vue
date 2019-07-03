<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <keep-alive>
      <router-view :key="$route.fullPath" />
    </keep-alive>
  </div>
</template>

<script>
import appConfig from '@src/app.config'
import { mapActions } from 'vuex'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  beforeMount() {
    this.fetchData()
  },
  methods: {
    ...mapActions({
      fetchData: 'map/fetchStaData',
    }),
  },
}
</script>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';
// multiselect
@import '~vue-multiselect/dist/vue-multiselect.min.css';
// mapbox
@import '~bootstrap-vue/dist/bootstrap-vue.css';
@import '@designsu';
// Design variables and utilities from src/design.
@import '@design';

// ===
// Vendor
// ===

body {
  background-color: $color-body-bg !important;
}
</style>
