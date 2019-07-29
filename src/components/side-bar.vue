<template>
  <nav
    class="d-none d-md-block nav-menu"
    :class="{ expanded: expandedSideNavBar }"
  >
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <a class="nav-item brand-img" href="#">
          <img src="@assets/images/SensorUp_logo_only_white.svg" alt="Logo" />
        </a>
        <a class="nav-item brand-img-logo" href="#">
          <img
            src="@assets/images/SensorUp_logo_no_gradient_white.svg"
            alt=""
          />
        </a>
        <nav-bar-routes :routes="persistentNavRoutes" />
      </ul>
    </div>
  </nav>
</template>
<script>
import NavBarRoutes from './nav-bar-routes'
import { mapGetters } from 'vuex'
export default {
  components: { NavBarRoutes },
  data() {
    return {
      showAvatar: false,
      persistentNavRoutes: [
        {
          name: 'overview',
          title: 'Overview',
          icon: 'home',
        },
        {
          name: 'sensors',
          title: 'Sensors',
          icon: 'cpu',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      expandedSideNavBar: 'general/expandedSideNavBar',
    }),
  },
  methods: {
    getIcon(icon) {
      return icon + 'Icon'
    },
  },
}
</script>
