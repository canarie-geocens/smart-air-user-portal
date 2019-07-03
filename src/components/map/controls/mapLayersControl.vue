<template>
  <div class="custom-control-icon">
    <a
      class="btn"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <i class="fas" :class="icon" />
    </a>
    <div class="dropdown-menu">
      <a
        v-for="(layer, index) in layers"
        :key="index"
        class="dropdown-item"
        href="#"
        @click="changeMapLayer(layer)"
      >
        {{ layer.name }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapLayersControl',
  props: {
    mapLayer: {
      type: String,
      required: true,
    },
    mapLayers: {
      type: Array,
      required: true,
    },
    icon: {
      type: String,
      default: 'fa-layer-group',
    },
  },
  computed: {
    layers() {
      return this.mapLayers
    },
  },
  methods: {
    changeMapLayer(layer) {
      this.$emit('update:mapLayer', layer.url)
    },
  },
}
</script>
