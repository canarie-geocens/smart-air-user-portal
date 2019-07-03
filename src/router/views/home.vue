<template>
  <layout>
    <side-panel>
      <div class="border-bottom">
        <div class="d-flex">
          <toggle-nav-button />
          <h5 class="text-muted mt-1">Overview</h5>
        </div>
      </div>
      <div class="sidebar-panel-content-scroll">
        <h5>Data Quality</h5>
        <layer-list />
        <hr />
        <div class="d-flex justify-content-between">
          <h5>Data Regriding</h5>
          <b-form-checkbox v-model="showGrid" switch name="check-button">
            Show Grid
          </b-form-checkbox>
        </div>
        <div v-show="showGrid">
          <div class="group-option">
            <city-select :city.sync="city" />
          </div>
          <h6 class="my-2">Basic</h6>
          <div class="group-option">
            <propety-select :observed-property.sync="observedProperty" />
            <time-select :date-time-value.sync="dateTimeValue" />
          </div>
          <h6 class="my-2">Grid</h6>
          <div class="group-option">
            Grid Size (Km)
            <area-radius :area-radius.sync="areaRadius" />
            Grid Type
            <grid-type :grid-type.sync="gridType" />
            Grid Width
            <grid-width :grid-width.sync="gridWidth" />
          </div>
        </div>
      </div>
    </side-panel>
    <main-content>
      <map-builder />
    </main-content>
  </layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import MainContent from '@layouts/main-content'
import SidePanel from '@layouts/side-panel'
import MapBuilder from '@components/map/map-builder'
import ToggleNavButton from '@components/toggle-nav-button'
import LayerList from '@components/panel/layer-list'
import PropetySelect from '@components/panel/propety-select'
import TimeSelect from '@components/panel/time-select'
import AreaRadius from '@components/panel/area-radius'
import GridType from '@components/panel/grid-type'
import GridWidth from '@components/panel/grid-width'
import CitySelect from '@components/panel/city-select'

const _ = require('lodash')
export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    MainContent,
    SidePanel,
    MapBuilder,
    ToggleNavButton,
    LayerList,
    PropetySelect,
    TimeSelect,
    AreaRadius,
    GridType,
    GridWidth,
    CitySelect,
  },
  computed: {
    interpolatedOptions() {
      return _.cloneDeep(this.$store.state.map.interpolatedOptions)
    },
    showGrid: {
      get() {
        return this.$store.state.map.showGridLayer
      },
      set(newValue) {
        this.showGridLayer(newValue)
      },
    },
    city: {
      get() {
        return { name: this.interpolatedOptions.city }
      },
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.city = newValue.name
          this.interpolatedOptions.latitude = newValue.latitude
          this.interpolatedOptions.longitude = newValue.longitude
        }
        this.loadGridLayer()
      },
    },
    observedProperty: {
      get() {
        return { value: this.interpolatedOptions.observedProperty }
      },
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.observedProperty = newValue.value
        }
        this.loadGridLayer()
      },
    },
    dateTimeValue: {
      get() {
        return this.interpolatedOptions.dateTimeValue
      },
      // '2019-04-04T11:00:47.157Z/2019-04-04T15:00:47.157Z'
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.dateTimeValue = newValue
        }
        this.loadGridLayer()
      },
    },
    areaRadius: {
      get() {
        return this.interpolatedOptions.areaRadius
      },
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.areaRadius = newValue
        }
        this.loadGridLayer()
      },
    },
    gridType: {
      get() {
        return this.interpolatedOptions.gridType
      },
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.gridType = newValue
        }
        this.loadGridLayer()
      },
    },
    gridWidth: {
      get() {
        return this.interpolatedOptions.gridWidth
      },
      set(newValue) {
        if (newValue) {
          this.interpolatedOptions.gridWidth = newValue
        }
        this.loadGridLayer()
      },
    },
  },
  // watch: {
  //   showGrid() {
  //     this.showGridLayer(this.showGrid)
  //   },
  // },
  methods: {
    ...mapMutations({
      setInterpolatedOptions: 'map/SET_INTERPOLATED_OPTIONS',
      showGridLayer: 'map/SET_SHOW_GRID_LAYER',
    }),
    ...mapActions({
      fetchInterpolatedGridData: 'map/fetchInterpolatedGridData',
    }),
    loadGridLayer() {
      this.setInterpolatedOptions(this.interpolatedOptions)
      this.fetchInterpolatedGridData(this.interpolatedOptions)
    },
  },
}
</script>
