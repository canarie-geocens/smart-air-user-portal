<template>
  <b-form-row>
    <b-col cols="8">
      <v-slider
        v-model="areaRadiusValue"
        :lazy="true"
        :adsorb="true"
        :included="true"
        :interval="10"
        :min="10"
        :max="300"
      />
    </b-col>
    <b-col cols="4">
      <b-form-input
        v-model.lazy="areaRadiusValue"
        type="number"
        step="10"
        placeholder=""
      />
    </b-col>
  </b-form-row>
</template>
<script>
export default {
  props: {
    areaRadius: {
      type: [Number, String],
      default: 30,
    },
  },
  data() {
    return {
      areaRadiusValue: 30,
    }
  },
  watch: {
    areaRadiusValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update:areaRadius', newVal)
      }
    },
  },
}
</script>
