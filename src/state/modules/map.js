import mapboxBaseLayers from '@assets/data/mapboxBaseLayers.json'
import cityGridSettings from '@assets/data/cityGridSerttings.json'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
const _ = require('lodash')

const STA_URL = process.env.VUE_APP_STA_URL
const SPATIOTEMPORAL_INTERPOLATION =
  process.env.VUE_APP_AQ_SPATIOTEMPORAL_INTERPOLATION

const baseHttp = axios.create({
  baseURL: STA_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const gridHttp = axios.create({
  baseURL: SPATIOTEMPORAL_INTERPOLATION,
})

export const state = {
  staData: null,
  cityGridSettings: cityGridSettings,
  mapboxToken: process.env.VUE_APP_MAPBOX_TOKEN,
  mapBaseLayers: mapboxBaseLayers,
  baseMapStyle: 'dark',
  mapboxMapVersion: 'v9',
  mapSettings: [],
  interpolatedOptions: {
    observedProperty: '',
    dateTimeValue: [],
    latitude: '',
    longitude: '',
    areaRadius: 30,
    gridType: 'square',
    gridWidth: 1,
  },
  interpolatedGrid: null,
  interpolatedValue: null,
  mapLayers: [
    {
      id: 'pm25',
      name: 'PM2.5 (Original)',
      show: true,
      color: '#a6cee3',
    },
    {
      id: '_pm25',
      name: 'PM2.5 (Processed)',
      show: true,
      color: '#1f78b4',
    },
    {
      id: 'humidity',
      name: 'Humidity (Original)',
      show: false,
      color: '#b2df8a',
    },
    {
      id: '_humidity',
      name: 'Humidity (Processed)',
      show: false,
      color: '#33a02c',
    },
    {
      id: 'temperature',
      name: 'Temperature (Original)',
      show: false,
      color: '#fb9a99',
    },
    {
      id: '_temperature',
      name: 'Temperature (Processed)',
      show: false,
      color: '#e31a1c',
    },
  ],
  showGridLayer: true,
  isLoading: false,
}

export const mutations = {
  SET_STA_DATA: (state, payload) => {
    let things = payload.reduce((acc, thing) => {
      thing = staPipesTransformation(thing)
      if (thing) {
        acc.push(thing)
      }
      return acc
    }, [])

    state.staData = things
  },
  SET_BASE_MAP: (state, payload) => {
    state.baseMapStyle = payload
  },
  SET_MAP_LAYERS(state, newValue) {
    state.mapLayers = JSON.parse(JSON.stringify(newValue))
  },
  SET_INTERPOLATED_GRID_DATA: (state, payload) => {
    state.interpolatedGrid = payload
  },
  SET_INTERPOLATED_VALUE_DATA: (state, payload) => {
    state.interpolatedValue = payload
  },
  SET_INTERPOLATED_OPTIONS: (state, payload) => {
    state.interpolatedOptions = payload
  },
  SET_SHOW_GRID_LAYER: (state, payload) => {
    state.showGridLayer = payload
  },
  SET_IS_LOADING: (state, payload) => {
    state.isLoading = payload
  },
}

export const getters = {
  staData: (state) => {
    return state.staData
  },
  cityGridSettings(state) {
    return state.cityGridSettings
  },
  baseMapStyle: (state) => {
    return generateMapboxMapStyle(state.baseMapStyle, state.mapboxMapVersion)
  },
  mapboxToken: (state) => {
    return state.mapboxToken
  },
  mapBaseLayers: (state) => {
    let mapBaseLayers = JSON.parse(JSON.stringify(state.mapBaseLayers))
    return mapBaseLayers
  },
  mapLayers(state) {
    return state.mapLayers
  },
  interpolatedOptions(state) {
    return state.interpolatedOptions
  },
  interpolatedGrid(state) {
    return state.interpolatedGrid
  },
  showGridLayer(state) {
    return state.showGridLayer
  },
  isLoading(state) {
    return state.isLoading
  },
}

function generateMapboxMapStyle(style, version) {
  // Tilesets hosted with Mapbox can be style-optimized if you append ?optimize=true to the end of your style URL, l
  return `mapbox://styles/mapbox/${style}-${version}?optimize=true`
}

export const actions = {
  async fetchStaData(state) {
    let sdt = Vue.moment()
      .subtract(1, 'days')
      .toISOString()
    let edt = Vue.moment().toISOString()

    let res = await followNextLink(
      baseHttp.get('/Things', {
        params: {
          $count: 'false',
          $expand:
            'Datastreams/Observations($top=1),Datastreams/Observations/FeatureOfInterest,Datastreams/ObservedProperty',
          $filter: `Datastreams/Observations/phenomenonTime ge ${sdt} and Datastreams/Observations/phenomenonTime le ${edt}`,
          $top: 2000,
        },
      })
    )

    state.commit('SET_STA_DATA', res.data.value)
  },
  fetchInterpolatedGridData: (state, payload) => {
    if (
      payload &&
      payload.observedProperty &&
      payload.dateTimeValue.length > 0 &&
      payload.longitude &&
      payload.latitude &&
      payload.areaRadius &&
      payload.gridType &&
      payload.gridWidth
    ) {
      let start = moment(payload.dateTimeValue[0]).toISOString()
      let end = moment(payload.dateTimeValue[1]).toISOString()

      state.commit('SET_IS_LOADING', true)
      gridHttp
        .get('/GetInterpolatedGrid', {
          params: {
            ObservedProperty: payload.observedProperty,
            time: `${start}/${end}`,
            latitude: payload.latitude,
            longitude: payload.longitude,
            areaRadius: payload.areaRadius,
            gridType: payload.gridType.toLowerCase(),
            gridWidth: payload.gridWidth,
          },
        })
        .then((res) => {
          state.commit('SET_INTERPOLATED_GRID_DATA', res.data)
          state.commit('SET_IS_LOADING', false)
        })
        .catch(() => {
          state.commit('SET_IS_LOADING', false)
        })
    }
  },
  fetchInterpolatedValueData: (state, payload) => {
    gridHttp
      .get('/GetInterpolatedValue', {
        params: {
          ObservedProperty: payload.ObservedProperty,
          time: payload.time,
          latitude: payload.latitude,
          longitude: payload.longitude,
        },
      })
      .then((res) => {
        state.commit('SET_INTERPOLATED_VALUE_DATA', res.data)
      })
  },
}

/**
 * Return the complete results in one array from the STA server in one array through following all @iot.nextLink links, and concatenating all the values
 * @param {Object} responsePromise: promise object
 * @return {Object} : promise object
 */
function followNextLink(responsePromise) {
  return responsePromise.then(function(lastSuccess) {
    if (lastSuccess.data['@iot.nextLink']) {
      return followNextLink(axios.get(lastSuccess.data['@iot.nextLink'])).then(
        function(nextLinkSuccess) {
          nextLinkSuccess.data.value = lastSuccess.data.value.concat(
            nextLinkSuccess.data.value
          )
          return nextLinkSuccess
        }
      )
    } else {
      return lastSuccess
    }
  })
}

/**
 * Convert the Thing entity into the GeoJSON formatted object
 * @param {Object} thing : thing entity
 * @return {Object} thing : converted thing object
 */
function staPipesTransformation(thing) {
  // get the first datastream with valid observations
  let ds = _.find(
    thing.Datastreams,
    (datastream) => datastream.Observations && datastream.Observations.length
  )

  // only return processed thing if the thing has a valid datastream
  if (ds) {
    // get all the thing's ObservedProperties
    let obArray = _.reduce(
      thing.Datastreams.filter(
        (datastream) =>
          datastream.Observations && datastream.Observations.length
      ),
      (acc, datastream) => {
        let dsName = datastream.name

        // prefix a '_' to the refined datastream
        let pName =
          dsName.indexOf('refined') > -1
            ? `_${datastream.ObservedProperty.name}`
            : datastream.ObservedProperty.name

        acc[pName] = datastream.Observations[0].result
        return acc
      },
      {}
    )
    let datetime = ds.Observations[0].phenomenonTime
    // let now = Vue.moment()
    let latestObDateTime = Vue.moment(datetime)
    // let duration = Vue.moment.duration(now.diff(latestObDateTime))
    // let active = duration.asDays() < 1

    return {
      type: 'Feature',
      geometry: ds.Observations[0].FeatureOfInterest.feature,
      properties: {
        name: thing.name,
        time: datetime,
        active: latestObDateTime.fromNow(),
        // append all the thing's properties
        ...thing.properties,
        ...obArray,
      },
    }
  } else {
    return null
  }
}
