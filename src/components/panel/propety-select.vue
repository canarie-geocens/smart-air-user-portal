<template>
  <b-form-group>
    <multiselect
      v-model="propertySelected"
      :options="propertyOptions"
      :searchable="true"
      :close-on-select="true"
      :show-labels="false"
      track-by="name"
      label="name"
      placeholder="Select ObservedPropety"
    ></multiselect>
  </b-form-group>
</template>
<script>
const _ = require('lodash')

export default {
  props: {
    observedProperty: {
      type: Object,
      default() {
        return { name: 'PM2.5', value: 'pm25' }
      },
    },
  },
  data() {
    return {
      propertySelected: '',
      propertyOptions: [
        { name: 'PM2.5', value: 'pm25' },
        { name: 'Temperature', value: 'temperature' },
        { name: 'Humidity', value: 'humidity' },
      ],
    }
  },
  watch: {
    propertySelected() {
      this.$emit('update:observedProperty', this.propertySelected)
    },
  },
  mounted() {
    // init the selected observedProperty
    if (this.observedProperty.value) {
      let index = _.find(this.propertyOptions, [
        'value',
        this.observedProperty.value,
      ])
      this.propertySelected = this.propertyOptions[index]
    } else {
      this.propertySelected = this.propertyOptions[0]
    }
  },
}
</script>

<style>
/* stylelint-disable */
.feather {
  width: 14px;
  stroke: #525252;
  stroke-width: 1;
}
.multiselect,
.multiselect__input,
.multiselect__single {
  font-size: 14px;
}
.multiselect__placeholder {
  padding-bottom: 6px;
}
.multiselect__option--highlight {
  color: #1886e8;
  background-color: #ecf3f7;
}
.multiselect__placeholder {
  margin-bottom: 0;
}
.multiselect__tags {
  min-height: 28px;
  padding: 6px 40px 0 10px;
  border: none;
  border-radius: 0;
}
.multiselect__option {
  min-height: 28px;
  padding: 8px;
}
.multiselect__content {
  background-color: white !important;
}
.multiselect__select::before {
  top: 50%;
}
.multiselect--active {
  .multiselect__select::before {
    top: 80%;
  }
  .multiselect__tags {
    padding: 6px 40px 4px 10px;
  }
}
.multiselect__select::before .multiselect__single {
  margin-bottom: 0;
}
.multiselect__content-wrapper {
  border: none;
  border-radius: 0;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
/* stylelint-enable */
</style>
