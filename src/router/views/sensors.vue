<template>
  <layout>
    <main-content>
      <div class="withSubNavbar">
        <nav class="navbar navbar-light bg-white">
          <a class="navbar-brand" href="#"> Sensors </a>
        </nav>
        <div class="main-content-padding">
          <div class="row pb-3">
            <div class="col-3">
              <div class="input-group">
                <div>
                  <search-icon size="1.5x" class="custom-class"></search-icon>
                </div>
                <b-form-input
                  v-model="searchInputTxt"
                  class="bottom-line  with-icon"
                  size="sm"
                  type="search"
                  placeholder="Search"
                  autocomplete="off"
                  state="true"
                />
              </div>
            </div>
            <div class="col-9">
              <router-link
                to="/sensors/register"
                tag="button"
                class="btn btn-sm btn-outline-primary with-icon float-right"
              >
                <base-icon name="plus" /> Register a new sensor
              </router-link>
            </div>
          </div>
          <sensor-list v-if="sensors" :sensors-list="filterSensors" />
        </div>
      </div>
    </main-content>
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Layout from '@layouts/main'
import MainContent from '@layouts/main-content'
import SensorList from '@components/sensor/sensor-list.vue'
import { SearchIcon } from 'vue-feather-icons'

export default {
  page: {
    title: 'Sensors',
    meta: [{ name: 'description', content: 'Sensors' }],
  },
  components: { Layout, MainContent, SensorList, SearchIcon },
  data() {
    return {
      searchInputTxt: '',
    }
  },
  computed: {
    ...mapGetters({
      staData: 'map/staData',
    }),
    sensors() {
      if (this.staData) {
        let arr = this.staData.reduce((acc, sta) => {
          if (sta) {
            acc.push({
              MAC: sta.properties.deviceId,
              name: sta.properties.displayName,
              location: sta.properties.city,
              PM: sta.properties.pm25,
              active: sta.properties.active,
            })
          }
          return acc
        }, [])

        return arr
      } else {
        return null
      }
    },
    filterSensors: function() {
      let searchValue = this.searchInputTxt.toLowerCase().replace(/\s/g, '')

      // Filtering each item (MAC, name and location) based on the input value
      let filteredMAC = this.sensors.filter(
        (s) => s.MAC.toLowerCase().indexOf(searchValue) > -1
      )
      let filteredName = this.sensors.filter(
        (s) => s.name.toLowerCase().indexOf(searchValue) > -1
      )
      let filteredLocation = this.sensors.filter(
        (s) => s.location.toLowerCase().indexOf(searchValue) > -1
      )

      // Merging the results
      let filteredSensors = filteredMAC
        .concat(filteredName)
        .concat(filteredLocation)

      // Removing duplicated values
      var uniquedFilteredSensors = filteredSensors.concat()
      for (var i = 0; i < uniquedFilteredSensors.length; ++i) {
        for (var j = i + 1; j < uniquedFilteredSensors.length; ++j) {
          if (uniquedFilteredSensors[i] === uniquedFilteredSensors[j])
            uniquedFilteredSensors.splice(j--, 1)
        }
      }

      return uniquedFilteredSensors
    },
  },
}
</script>
