<template>
  <button class="btn btn-link btn-sm order-1 order-sm-0" @click="toggleNavBar">
    <base-icon name="bars" />
  </button>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      expandedSideNavBar: 'general/expandedSideNavBar',
    }),
  },
  methods: {
    ...mapActions({
      expandSideNavBar: 'general/expandSideNavBar',
    }),
    toggleNavBar() {
      if (this.expandedSideNavBar) {
        this.expandSideNavBar(false)
      } else {
        this.expandSideNavBar(true)
      }
    },
  },
}
</script>
