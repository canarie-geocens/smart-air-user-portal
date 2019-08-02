<template>
  <div class="card dashboard">
    <div class="content" @mouseover="hover = true" @mouseleave="hover = false">
      <div class="card-body p-0">
        <div v-if="hover">
          <div>
            <router-link
              :to="{ name: 'download', params: { myProperty: sensor.MAC } }"
              tag="button"
              class="btn btn-sm btn-outline-primary with-icon float-right"
            >
              <download-cloud-icon />
            </router-link>
          </div>
        </div>
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
import { MapPinIcon, DownloadCloudIcon } from 'vue-feather-icons'
export default {
  name: 'SensordItem',
  components: {
    MapPinIcon,
    DownloadCloudIcon,
  },
  props: {
    sensor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
    }
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
