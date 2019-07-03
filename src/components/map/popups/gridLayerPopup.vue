<template>
  <div>
    <p>{{ getPropertyName(property) }} : {{ getPropertyValue(property) }}</p>
  </div>
</template>

<script>
export default {
  name: 'GridLayerPopupContent',
  props: {
    feature: {
      type: Object,
      required: true,
    },
    property: {
      type: String,
      required: true,
    },
  },
  methods: {
    getPropertyName(property) {
      return property
    },
    getPropertyValue(property) {
      return this.feature.properties[property] !== undefined
        ? Math.round(this.feature.properties[property])
        : 'N/A'
    },
  },
}
</script>
