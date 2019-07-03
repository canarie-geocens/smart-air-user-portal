<template>
  <div>
    <h6>Device: {{ feature.properties.deviceId }} </h6>
    <ul>
      <li v-for="(layer, index) in layers" :key="index"
        >{{ getPropertyName(layer) }} : {{ getPropertyValue(layer) }}</li
      >
    </ul>
    {{ feature.properties.time | moment('lll') }}
  </div>
</template>

<script>
export default {
  name: 'PopupContent',
  props: {
    feature: {
      type: Object,
      required: true,
    },
    layers: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    getPropertyName(layer) {
      let name = layer

      return name.startsWith('_')
        ? (name = name.replace('_', '') + '(Processed)')
        : (name = name + '(Original)')
    },
    getPropertyValue(property) {
      return this.feature.properties[property] !== undefined
        ? this.feature.properties[property]
        : 'N/A'
    },
  },
}
</script>

<style>
/* stylelint-disable */
.mapboxgl-popup {
  min-width: 200px;
  max-width: 400px;
}
/* stylelint-enable */
</style>
