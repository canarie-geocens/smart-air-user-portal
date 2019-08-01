<template>
  <layout>
    <main-content>
      <div class="withSubNavbar">
        <nav class="navbar navbar-light bg-white">
          <h2 class="col-sm-4"> Device {{ recievedProperty }}/ Exporter</h2>
        </nav>
        <div v-cloak id="main">
          <div class="row">
            <div class="col pt-0">

                <div class="card">

                  <div id="headingFilters" class="card-header">
                    <h5 class="col-md-12">Filters</h5>
                  </div>

                  <div id="collapseFilters" class="collapse show" aria-labelledby="headingFilters">
                    <div class="card-body">
                      <div class="form-row mt-2">
                        <div class="form-group col-md-4">
                          <label>Observed Properties</label>
                          <multiselect v-model="observedPropertiesValue" :options="observedPropertiesOptions"
                                       :close-on-select="true" :searchable="false"
                                       :show-labels="false" :multiple="true"
                                       placeholder="Select" >

                          </multiselect>

                        </div>

                        <div class="form-group col-md-4">
                          <label>Date range <span class="text-secondary" style="font-size: 0.75rem">(UTC)</span></label>
                          <flat-pickr v-model="timeRangeFilterDate" :config="timeRangeFilterConfig" placeholder="Select a date range"></flat-pickr>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

            </div>
          </div>
          <div class="row pt-3 mt-2">
            <div class="col-xl-12">
              <div class="small-headline mb-2">Export</div>
              <button class="btn btn-primary" style="margin-left: 2px; display:inline-block;" @click="setPreviewAction()">Show Preview</button>
              <sta-data-exporter
                      style="margin-left: 4px;"
                      class="btn btn-primary"
                      :json-fields="export_fields"
                      :cb-function="setDownloadAction"
                      :name="exportFileName"
              />
            </div>
          </div>
          <div class="alert alert-primary" v-show="previewTableSettings.data.length" role="alert">
            This preview table shows only a subset of the data.
          </div>
          <div class="mt-2 mb-4" style="width: 100%; height: 600px; overflow-x: scroll">
            <hot-table :settings="previewTableSettings"></hot-table>
          </div>
        </div>
      </div>
    </main-content>
  </layout>
</template>

<script>
  import { mapGetters, mapActions} from 'vuex';
  import Vue from 'vue';
  import Layout from '@layouts/main';
  import MainContent from '@layouts/main-content';
  import staRequests from './sta-request';
  import HotTable from '@handsontable/vue';
  import staHeaders from '@components/data-exporter/sta-headers.js';
  import staDataExporter from '@components/data-exporter/staDataExporter';
  import 'handsontable/dist/handsontable.full.css';
  import _ from 'lodash';


  export default {
    components: {Layout, MainContent,HotTable,staDataExporter},
    data() {
      return {
        isLoading: false,

        requiredAction : 'preview',
        tableData : [{}],
        tableDataCSV : [{}],
        headerColumns: [
          staHeaders.table['observation-phenomenonTime']['display'],
          staHeaders.table['observation-result']['display'],
          staHeaders.table['thing-name']['display'],
          staHeaders.table['location-name']['display'],
          staHeaders.table['observedProperty-name']['display']
        ],

        thingsValue: [this.uuid],
        observedPropertiesValue: [],
        observedPropertiesOptions: ['Humidity', 'Temperature', 'PM2.5'],

        staHeadersValues: {
          observation: [ staHeaders.table['observation-phenomenonTime'], staHeaders.table['observation-result'] ],
          thing: [],
          location: [ staHeaders.table['location-name'], staHeaders.table['location-description'], staHeaders.table['location-location-geojson'] ],
          datastream: [staHeaders.table['datastream-uom-symbol']],
          observedProperty: [ staHeaders.table['observedProperty-description'] ],
          sensor: [staHeaders.table['sensor-name']],
          featureOfInterest: []
        },

        staHeaders: {
          thing: JSON.parse(JSON.stringify(staHeaders.thing)),
          location: JSON.parse(JSON.stringify(staHeaders.location)),
          datastream: JSON.parse(JSON.stringify(staHeaders.datastream)),
          observedProperty: JSON.parse(JSON.stringify(staHeaders.observedProperty)),
          sensor: JSON.parse(JSON.stringify(staHeaders.sensor)),
          featureOfInterest: JSON.parse(JSON.stringify(staHeaders.featureOfInterest)),
          observation: JSON.parse(JSON.stringify(staHeaders.observation))
        },

        previewTableSettings: {
          autoColumnSize: { syncLimit: 300 },
          data: [],
          dataSchema: {},
          columns: [],
          colHeaders: [],
          stretchH: 'all',
          columnSorting: true,
          sortIndicator: true,
          licenseKey: 'non-commercial-and-evaluation',
          copyPaste: false
        },

        recievedProperty: '',
        uuid: '',

        timeRangeFilterDate: null,
        timeRangeFilterConfig: {
          altFormat: "F j, Y",
          altInput: true,
          mode: 'range'
        },
      }
    },
    computed: {
      ...mapGetters({
        staDataExport: 'map/staDataExport',
      }),

      exportFileName() {
        let prefix = 'SensorUp AirQ_Device ' + this.recievedProperty + ' sta_data';
        return this.timeRangeFilterDate ? prefix + '_' + this.timeRangeFilterDate : prefix
      },

      export_fields() {
        var rv = {}
        for (var i = 0; i < this.headerColumns.length; ++i)
          rv[this.headerColumns[i]] = this.headerColumns[i]
        return rv
      },

    },
    watch: {
      staHeadersValues: {
        handler: function(newValue, oldValue) {

          this.updatePreviewTable(newValue, oldValue);
        },
        deep: true,
      },
    },
    created() {
      this.recievedProperty = this.$route.params.myProperty;
      this.uuid = this.$route.params.uuid;
    },
    methods: {
      ...mapActions({
        fetchSensorData: 'map/fetchSensorData',
        setPhenomenonTime: 'map/setPhenomenonTime',
      }),

      updatePreviewTable: async function(newValue, oldValue) {
        let dataSchema = _.reduce(newValue, (result, value, key) => {
            value.forEach(o => (result[o.display] = null));

            return result;
        }, {});

        this.previewTableSettings.dataSchema = dataSchema;
        let columns = _.reduce(newValue, (result, value, key) => {
            value.forEach(o => result.push({ 'data': o.display }));
            return result;
        }, []);


        this.previewTableSettings.columns = columns;
        this.previewTableSettings.colHeaders = _.flatMap(newValue, entity => {
            return entity.map(o => o.display);
        });

        this.headerColumns = _.flatMap(newValue, entity => {
          return entity.map(o => o.display);
        });

        this.previewTableSettings.data = this.tableData;
        // this.previewTableSettings.overflow = scroll;
      },
      setDownloadAction: async function(){
        this.isLoading = true;
        this.requiredAction = 'download';
        await this.previewTable(this.requiredAction)
        this.isLoading = false;
        alert('data is loaded!');
        return this.tableDataCSV;
      },
      setPreviewAction: function(){
        this.requiredAction = 'preview';
        this.previewTable( this.requiredAction)
      },
      previewTable: async function (option) {
        let selectedFilters = [];
        for (var key in this.staHeadersValues) {
          if (this.staHeadersValues[key].length > 0){
            this.staHeadersValues[key].forEach(obs => {
              selectedFilters.push({'entity': obs["entity"],'field': obs["field"], 'display' : obs["display"]})
            })
          }
        }
        if(option === 'preview'){
          await staRequests.getSpecificThing(this.recievedProperty, this.observedPropertiesValue, this.timeRangeFilterDate,selectedFilters,this.requiredAction).then(response => (this.tableData = response))
        } else {
          await staRequests.getSpecificThing(this.recievedProperty, this.observedPropertiesValue, this.timeRangeFilterDate,selectedFilters,this.requiredAction).then(response => (this.tableDataCSV = response))
        }

        Vue.nextTick(() => {
          this.updatePreviewTable(this.staHeadersValues);
        });

      },

    }
  }
</script>
<style lang="scss">
  @import "~bootstrap/scss/bootstrap";
  .small-headline {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .card {
    margin-top: -1px;
    border-radius: 0;
  }

  .card-header {
    padding: 0;
    border-bottom: 0;

  }

  .card-body {
    padding: 0 0.75rem;
  }

  .flatpickr-input[readonly] {
    background-color: inherit;
  }
  .handsontable.ht_clone_top {
    z-index: inherit;
  }

  .handsontable th {
    background-color: #007bff;
  }

  .handsontable td.area {
    background-color: #007bff;
  }
  .ht_master tr > td.current {
    background-color: #F00;
  }


  .multiselect__tags-wrap .multiselect__tag {
    background-color: #007bff;
  }

  .multiselect__option.multiselect__option--highlight, .multiselect__option.multiselect__option--highlight::after {
    background-color: #007bff !important;
  }
  .multiselect__tag-icon {
    background-color: #007bff;
  }

  .multiselect__tag-icon:hover {
    background-color: #0070ea;
  }

  .multiselect__tag-icon::after {
    color: white;}
</style>
