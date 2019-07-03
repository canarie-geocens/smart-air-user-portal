<template>
  <!-- map component -->
  <div
    :id="mapOptions.hasOwnProperty('container') ? mapOptions.container : 'map'"
    :class="$style.mapStyle"
  >
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    <map-legend
      v-if="showLegend && colourScheme && colourScheme.length > 0"
      :colour-scheme="colourScheme"
      :legend-range="legendRange"
      :unit="unit"
    />
  </div>
</template>
<script>
/* global mapboxgl */
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { MapSimplePopup, GridLayerPopup } from './popups'
import { MapLegend } from './controls'

const chance = require('chance').Chance()
const _ = require('lodash')
const turf = require('@turf/turf')

export default {
  name: 'MapBuilder',
  components: {
    MapLegend,
  },
  data() {
    return {
      map: null,
      mapStyleLoaded: false,
      mapZoom: 4,
      mapCenter: [-96.3468, 55.0304],
      navControl: {
        show: true,
        position: 'top-right',
      },
      scaleControl: {
        show: true,
        position: 'top-left',
      },
      sourceId: 'geocens',
      gridSourceId: 'geocensGrid',
      gridLayerId: 'gridLayer',
      PopupContent: Vue.extend(MapSimplePopup),
      GridLayerPopupContent: Vue.extend(GridLayerPopup),
      popup: null,
      fullPage: true,
      showLegend: true,
      colourScheme: [],
      legendRange: null,
      unit: null,
    }
  },
  computed: {
    ...mapGetters({
      baseMapStyle: 'map/baseMapStyle',
      mapboxToken: 'map/mapboxToken',
      staData: 'map/staData',
      mapLayers: 'map/mapLayers',
      interpolatedGrid: 'map/interpolatedGrid',
      showGridLayer: 'map/showGridLayer',
      isLoading: 'map/isLoading',
    }),
    layerIds() {
      return _.map(this.mapLayers, 'id')
    },
    mapId() {
      const uuid = chance.guid({ version: 4 })
      return 'map_' + uuid
    },
    mapOptions() {
      return {
        container: this.mapId,
        style: this.baseMapStyle,
        center: this.mapCenter,
        zoom: this.mapZoom,
      }
    },
    /**
     * Find the index of the first symbol layer in the map style
     */
    placeCityLayerId() {
      let firstSymbolId
      if (this.map) {
        let layers = this.map.getStyle().layers
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].id === 'place_city') {
            firstSymbolId = layers[i].id
            break
          }
        }
      }
      return firstSymbolId || 0
    },
    observedProperty() {
      return this.$store.state.map.interpolatedOptions.observedProperty
    },
    currentCityCenter() {
      let lat = this.$store.state.map.interpolatedOptions.longitude
      let lng = this.$store.state.map.interpolatedOptions.latitude

      return lat && lng ? [lat, lng] : null
    },
    gridType() {
      return this.$store.state.map.interpolatedOptions.gridType
    },
  },
  watch: {
    mapLayers() {
      if (this.staData && this.mapStyleLoaded) {
        this.removePopup()
        this.clearAllLayers()
        this.drawLayers()
      }
    },
    staData() {
      if (this.staData && this.mapStyleLoaded) {
        this.displayLayers()
      }
    },
    interpolatedGrid() {
      if (this.interpolatedGrid && this.mapStyleLoaded) {
        this.displayGrids()
      }
    },
    currentCityCenter() {
      if (this.currentCityCenter) {
        this.map.setCenter(this.currentCityCenter)
        this.map.setZoom(10)
      }
    },
    showGridLayer() {
      let visibility = this.showGridLayer ? 'visible' : 'none'
      this.toggleLayer(this.gridLayerId, visibility)
      this.showLegend = this.showGridLayer
    },
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    this.map.remove()
  },

  methods: {
    ...mapActions({
      fetchInterpolatedGridData: 'map/fetchInterpolatedGridData',
      fetchInterpolatedValueData: 'map/fetchInterpolatedValueData',
    }),
    /**
     * Init the map components and register events
     */
    initMap() {
      // Mapbox GL access token
      if (this.mapboxToken) {
        mapboxgl.accessToken = this.mapboxToken
      }
      // Add container to options object
      if (!this.mapOptions.hasOwnProperty('container')) {
        this.mapOptions.container = 'map'
      }

      this.map = new mapboxgl.Map(this.mapOptions)

      this.map.on('load', (e) => {
        this.mapLoaded(this.map)
      })

      this.map.on('styledata', (e) => {
        this.mapStyleChanged(this.map, e)
      })

      this.addControls(this.map)
    },
    mapLoaded(map) {
      this.mapStyleLoaded = true
      if (this.staData) {
        this.displayLayers()
      }
    },
    mapStyleChanged(map, e) {},
    /**
     * Draw property layers
     */
    displayLayers() {
      this.removePopup()
      // remove layers before remvoing the associate data source
      this.clearAllLayers()

      this.clearSource()
      this.addDataSource()

      this.drawLayers()
      this.registerEvents(this.map)
    },
    /**
     * Draw grids
     */
    displayGrids() {
      this.clearLayer(this.gridLayerId)
      this.clearGridSource()
      this.addGridDataSource()
      this.drawGridLayer()
    },
    /**
     * Add property layers data source
     */
    addDataSource() {
      this.map.addSource(this.sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.staData,
        },
      })
    },
    /**
     * Add grid data source
     */
    addGridDataSource() {
      this.map.addSource(this.gridSourceId, {
        type: 'geojson',
        data: this.interpolatedGrid,
      })
    },
    /**
     * Render all property layers
     */
    drawLayers() {
      let layers = _.cloneDeep(this.mapLayers).reverse()
      for (let i in layers) {
        this.drawPropertyLayer(layers[i])
      }
      this.toggleLayers()
    },
    /**
     * Render the specific property layer
     */
    drawPropertyLayer(property) {
      let layerId = `${property.id}`
      let propertyLayer = {
        id: layerId,
        interactive: true,
        type: 'circle',
        source: this.sourceId,
        paint: {
          'circle-radius': 8,
          'circle-color': property.color,
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': property.color,
        },
      }
      if (this.map.getLayer(this.gridLayerId)) {
        this.map.addLayer(propertyLayer, this.gridLayerId)
      } else {
        this.map.addLayer(propertyLayer)
      }
    },
    drawGridLayer() {
      let fillColor

      if (this.observedProperty === 'pm25') {
        this.colourScheme = [
          'rgb(46, 125, 50)',
          'rgb(255, 238, 88)',
          'rgb(251, 140, 0)',
          'rgb(198, 40, 40)',
          'rgb(152, 0, 67)',
          'rgb(103, 0, 31)',
        ]
        this.legendRange = [0, 250]
        this.unit = 'μg/m³'
        fillColor = {
          property: 'pm25',
          stops: [
            [0, this.colourScheme[0]],
            [12.1, this.colourScheme[1]],
            [35.5, this.colourScheme[2]],
            [55.5, this.colourScheme[3]],
            [150.5, this.colourScheme[4]],
            [250.5, this.colourScheme[5]],
          ],
        }
      } else if (this.observedProperty === 'temperature') {
        this.colourScheme = [
          '#8c96c6',
          '#edf8fb',
          'rgb(255, 238, 88)',
          'rgb(251, 140, 0)',
          'rgb(152, 0, 67)',
          'rgb(103, 0, 31)',
        ]
        this.legendRange = [-30, 45]
        this.unit = '°C'
        fillColor = {
          property: 'temperature',
          stops: [
            [-30, this.colourScheme[0]],
            [-15, this.colourScheme[1]],
            [0, this.colourScheme[2]],
            [15, this.colourScheme[3]],
            [30, this.colourScheme[4]],
            [45, this.colourScheme[5]],
          ],
        }
      } else if (this.observedProperty === 'humidity') {
        this.colourScheme = [
          'rgb(152, 0, 67)',
          'rgb(255, 238, 88)',
          'rgb(46, 125, 50)',
          'rgb(255, 238, 88)',
          'rgb(152, 0, 67)',
        ]
        this.legendRange = [0, 100]
        this.unit = '%'
        fillColor = {
          property: 'humidity',
          stops: [
            [10, this.colourScheme[0]],
            [30, this.colourScheme[1]],
            [50, this.colourScheme[2]],
            [70, this.colourScheme[3]],
            [90, this.colourScheme[4]],
          ],
        }
      }

      let gridLayer
      if (this.gridType.toLowerCase() === 'point') {
        gridLayer = {
          id: this.gridLayerId,
          interactive: true,
          type: 'circle',
          source: this.gridSourceId,
          paint: {
            'circle-radius': 5,
            'circle-color': fillColor,
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': fillColor,
          },
        }
      } else {
        gridLayer = {
          id: this.gridLayerId,
          interactive: true,
          type: 'fill',
          source: this.gridSourceId,
          paint: {
            'fill-color': fillColor,
            'fill-opacity': 0.8,
            'fill-outline-color': '#fff',
          },
        }
      }

      this.map.addLayer(gridLayer)
    },
    /**
     * Toggle all layers display status
     */
    toggleLayers() {
      for (let i in this.mapLayers) {
        let visibility = this.mapLayers[i].show ? 'visible' : 'none'
        this.toggleLayer(this.mapLayers[i].id, visibility)
      }
    },
    /**
     * Toggle the specified layer display status
     */
    toggleLayer(layerId, visibility) {
      let layer = this.map.getLayer(layerId)
      if (layer) {
        this.map.setLayoutProperty(layerId, 'visibility', visibility)
      }
    },
    /**
     * Remove the data source
     */
    clearSource() {
      if (this.map.getSource(this.sourceId)) {
        this.map.removeSource(this.sourceId)
      }
    },
    /**
     * Remove the Grid data source
     */
    clearGridSource() {
      if (this.map.getSource(this.gridSourceId)) {
        this.map.removeSource(this.gridSourceId)
      }
    },
    /**
     * Remove both the specified layer and source from the map
     */
    clearLayer(id) {
      if (this.map.getLayer(id)) {
        this.map.removeLayer(id)
      }
    },
    /**
     * Remove all layers
     */
    clearAllLayers() {
      for (let i in this.mapLayers) {
        this.clearLayer(this.mapLayers[i].id)
      }
    },
    /**
     * Map clicked event handler
     */
    mapClicked(map, e) {
      this.addPopUp(map, e)
      this.addGridLayerPopUp(map, e)
    },

    /**
     * Display features' information in a popup
     */
    addPopUp(map, e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: this.layerIds,
      })
      if (!features.length) {
        return
      }

      const feature = features[0]

      // Populate the popup and set its coordinates
      // based on the feature found.
      this.popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML('<div id="vue-popup-content"></div>')
        .addTo(map)

      // center the clicked device
      this.map.setCenter(feature.geometry.coordinates)

      let activeLayers = _.map(_.filter(this.mapLayers, { show: true }), 'id')
      new this.PopupContent({
        propsData: {
          feature: feature,
          layers: activeLayers,
        },
      }).$mount('#vue-popup-content')
    },
    /**
     * Display features' information in a popup
     */
    addGridLayerPopUp(map, e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [this.gridLayerId],
      })
      if (!features.length) {
        return
      }

      const feature = features[0]
      let grid = turf.polygon(feature.geometry.coordinates)
      let centroid = turf.centroid(grid)
      // Populate the popup and set its coordinates
      // based on the feature found.
      this.popup = new mapboxgl.Popup()
        .setLngLat(centroid.geometry.coordinates)
        .setHTML('<div id="vue-popup-content"></div>')
        .addTo(map)

      new this.GridLayerPopupContent({
        propsData: {
          feature: feature,
          property: this.observedProperty,
        },
      }).$mount('#vue-popup-content')
    },
    /**
     * Delete the popup
     */
    removePopup() {
      if (this.popup) {
        this.popup.remove()
      }
    },
    /**
     * Add map controls
     */
    addControls(map) {
      // Nav Control
      if (this.navControl.show) {
        const nav = new mapboxgl.NavigationControl()
        map.addControl(nav, this.navControl.position)
      }

      // Scale Control
      if (this.scaleControl.show) {
        const scale = new mapboxgl.ScaleControl(this.scaleControl.options)
        map.addControl(scale, this.scaleControl.position)
      }
    },
    /**
     * Register map events
     */
    registerEvents(map) {
      // Map Clicked
      map.on('click', (e) => {
        this.mapClicked(map, e)
      })
    },
  },
}
</script>

<style lang="scss" module>
.mapStyle {
  width: 100%;
  height: 100%;
}
</style>
