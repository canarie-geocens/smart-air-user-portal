<template>
  <multiselect
    v-model="citySelected"
    :options="cityGridSettings"
    :searchable="true"
    track-by="name"
    label="name"
    :close-on-select="true"
    :show-labels="false"
    placeholder="Select City"
  ></multiselect>
</template>
<script>
import { mapGetters } from 'vuex'
const _ = require('lodash')
export default {
  props: {
    city: {
      type: Object,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      citySelected: '',
    }
  },
  computed: {
    ...mapGetters({
      cityGridSettings: 'map/cityGridSettings',
    }),
  },
  watch: {
    citySelected() {
      this.$emit('update:city', this.citySelected)
    },
  },
  mounted() {
    if (this.city.name) {
      let index = _.find(this.cityGridSettings, ['name', this.city])
      this.citySelected = this.cityGridSettings[index]
    }
  },
}
</script>
