<template>
  <div class="map-overlay-inner legend-content ">
    <div class="legend-bar" :style="legendBarStyle" />
    <div class="legend-text d-flex align-items-center justify-content-between">
      <span>{{ legendRange[0] }}({{ unit }})</span>
      <span>{{ legendRange[1] }}({{ unit }})</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MapLegend',
  props: {
    colourScheme: {
      type: Array,
      required: true,
    },
    legendRange: {
      type: Array,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  computed: {
    legendBarStyle() {
      return 'background: linear-gradient(to right,' + this.colourScheme + ');'
    },
  },
}
</script>

<style lang="scss">
/* stylelint-disable */

.map-overlay-inner {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 9999;
  width: 200px;
  margin: 10px 0 0 10px;
}

.legend-content {
  .legend-bar {
    height: 10px;
  }

  .legend-text span {
    font-size: 14px;
    color: white;
  }
}
/* stylelint-enable */
</style>
