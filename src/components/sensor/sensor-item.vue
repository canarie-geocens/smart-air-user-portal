<template>
  <div class="card dashboard">
    <div class="content">
      <div class="card-body p-0">
        <h5 class="card-title">Device {{ sensor.MAC }}</h5>
        <p class="card-text text-muted capitalize">{{ sensor.name }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div><map-pin-icon /> {{ sensor.location }}</div>
          <small class="text-muted"
            >{{ sensor.PM }} (μg/m³)( {{ sensor.active }})</small
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MapPinIcon } from 'vue-feather-icons'

export default {
  name: 'SensordItem',
  components: {
    MapPinIcon,
  },
  props: {
    sensor: {
      type: Object,
      required: true,
    },
  },
  methods: {
    isActive(active) {
      return active ? 'online' : 'offline'
    },
  },
}
</script>

<style>
.feather {
  width: 16px;
  height: 16px;
}
.lowercase {
  text-transform: lowercase;
}
.uppercase {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}
</style>
