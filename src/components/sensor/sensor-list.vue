<template>
  <div class="row">
    <div
      v-for="sensor in sensorsList"
      :key="sensor.id"
      class="col-lg-3 col-md-6 col-xs-12"
    >
      <sensor-item :sensor="sensor" />
    </div>
  </div>
</template>
<script>
import SensorItem from '@components/sensor/sensor-item'
export default {
  name: 'SensorList',
  components: {
    SensorItem,
  },
  props: {
    sensorsList: {
      type: Array,
      required: true,
    },
  },
}
</script>
