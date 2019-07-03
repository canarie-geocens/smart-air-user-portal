<template>
  <b-form-row>
    <b-col cols="8">
      <v-slider
        v-model="gridWidthValue"
        :lazy="true"
        :adsorb="true"
        :included="true"
        :interval="0.5"
        :min="0.5"
        :max="10"
      />
    </b-col>
    <b-col cols="4">
      <b-form-input
        v-model.lazy="gridWidthValue"
        type="number"
        min="0.5"
        max="10"
        step="0.5"
        :disabled="widthInputDisabled"
      />
    </b-col>
  </b-form-row>
</template>
<script>
export default {
  props: {
    gridWidth: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      gridWidthValue: 1,
      widthInputDisabled: false,
    }
  },
  computed: {
    areaRadius() {
      return this.$store.state.map.interpolatedOptions.areaRadius
    },
  },
  watch: {
    gridWidthValue(newVal, oldVal) {
      if (this.areaRadius > 200) {
        this.gridWidthValue = 10
        this.widthInputDisabled = true
      } else if (this.areaRadius <= 200 && newVal !== oldVal) {
        this.widthInputDisabled = false
        this.$emit('update:gridWidth', this.newVal)
      }
    },
    areaRadius() {
      if (this.areaRadius > 200) {
        this.gridWidthValue = 10
        this.widthInputDisabled = true
        this.$emit('update:gridWidth', this.gridWidthValue)
      } else {
        this.widthInputDisabled = false
      }
    },
  },
  methods: {
    update() {},
  },
}
</script>
