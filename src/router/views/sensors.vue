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
              <b-form-input
                class="bottom-line"
                size="sm"
                type="text"
                placeholder="All Show"
              />
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
          <sensor-list v-if="sensors" :sensors-list="sensors" />
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
export default {
  page: {
    title: 'Sensors',
    meta: [{ name: 'description', content: 'Sensors' }],
  },
  components: { Layout, MainContent, SensorList },
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
  },
}
</script>
