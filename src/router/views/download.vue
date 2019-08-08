<template>
    <layout>
        <main-content>
            <div class="withSubNavbar">
                <nav class="navbar navbar-light bg-white">
                    <h2 class="navbar-brand">
                        <router-link to="/sensors" tag="button" id="test" class="btn navbar-brand btn-link h2" >Sensor List</router-link>/ Device {{ recievedProperty }} / Export</h2>
                </nav>
                <div v-cloak id="main" style="overflow-x: hidden;">
                    <div class="row">
                        <div class="col pt-0">
                            <div class="card">

                                <div id="headingFilters" class="card-header">
                                    <h5 class="card-title">Filters</h5>
                                </div>

                                <div id="collapseFilters" class="collapse show" aria-labelledby="headingFilters">
                                    <div class="card-body">
                                        <div class="form-row mt-2">
                                            <div class="form-group col-md-4">
                                                <label>Observed Properties</label>
                                                <multiselect v-model="observedPropertiesValue" style="border-color:black"
                                                             :options="observedPropertiesOptions"
                                                             :close-on-select="true" :searchable="false"
                                                             :show-labels="true" :multiple="true"
                                                             placeholder="Select">
x
                                                </multiselect>
                                            </div>

                                            <div class="form-group col-md-4">
                                                <label>Date range <span class="text-secondary"
                                                                        style="font-size: 0.75rem">(UTC)</span></label>
                                                <flat-pickr v-model="timeRangeFilterDate"
                                                            :config="timeRangeFilterConfig"
                                                            placeholder="Select a date range"
                                                            class="flatpickr-input"></flat-pickr>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div class="row">
                        <div class="col pt-0">
                            <div class="card">
                                <div id="headingFilters" class="card-header">
                                    <h5 class="card-title">Export</h5>
                                </div>
                                <div class="card-body">
                                    <div class="row pt-3 mt-2">
                                        <div class="col-xl-12">
                                            <button :id="[ isLoading ? 'disabled' : 'enabled' ]" class="btn btn-primary" style="margin-bottom: 4px"
                                                    @click="setPreviewAction()">Show Preview
                                            </button>
                                            <sta-data-exporter
                                                    :id="[ isLoading ? 'disabled' : 'enabled' ]"
                                                    style="margin-bottom: 4px; margin-left: 4px"
                                                    class="btn btn-primary"
                                                    :json-fields="export_fields"
                                                    :cb-function="setDownloadAction"
                                                    :name="exportFileName"
                                                    :before-loading="startProgress"
                                                    :after-loading="endProgress"
                                            />
                                            <div v-show="isLoading"
                                                 class="spinner-border spinner-border-sm text-primary"
                                                 style="display:inline-block; margin-left: 5px; " role="status"
                                                 aria-hidden="true"></div>
                                            <sweet-modal ref="Unsuccessful" icon="error" title="Error happened...">
                                                {{statusResult}}
                                            </sweet-modal>
                                            <div v-show="previewTableSettings.data.length" class="alert alert-primary"
                                                 role="alert"
                                                 style="margin-top: 4px; margin-bottom: 4px">
                                                This preview table shows only a subset of the data
                                            </div>
                                            <div class="mt-2 mb-4"
                                                 style="width: 100%; height: 750px; overflow-x: hidden">
                                                <hot-table :settings="previewTableSettings"></hot-table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main-content>
    </layout>
</template>

<script>
    import {SweetModal} from 'sweet-modal-vue'
    import Layout from '@layouts/main';
    import MainContent from '@layouts/main-content';
    import staRequests from './sta-request';
    import HotTable from '@handsontable/vue';
    import staHeaders from '@components/data-exporter/sta-headers.js';
    import staDataExporter from '@components/data-exporter/staDataExporter';
    import 'handsontable/dist/handsontable.full.css';
    import _ from 'lodash';


    export default {
        components: {Layout, MainContent, HotTable, staDataExporter, SweetModal},
        data() {
            return {
                isLoading: false,
                statusResult: '',
                requiredAction: 'preview',
                tableData: [{}],
                tableDataCSV: null,
                headerColumns: [
                    staHeaders.table['observation-phenomenonTime']['display'],
                    staHeaders.table['observation-result']['display'],
                    staHeaders.table['location-name']['display'],
                    staHeaders.table['observedProperty-description']['display']
                ],

                observedPropertiesValue: ['Humidity', 'Temperature', 'PM2.5'],
                observedPropertiesCompleteSet: ['Humidity', 'Temperature', 'PM2.5'],


                staHeadersValues: {
                    observation: [staHeaders.table['observation-phenomenonTime'], staHeaders.table['observation-result']],
                    observedProperty: [staHeaders.table['observedProperty-description']],
                    datastream: [staHeaders.table['datastream-uom-symbol']],
                    location: [staHeaders.table['location-name'], staHeaders.table['location-description'], staHeaders.table['location-location-geojson']],
                    sensor: [staHeaders.table['sensor-name']],
                },

                previewTableSettings: {
                    autoColumnSize: {syncLimit: 300},
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

                timeRangeFilterDate: null,
                timeRangeFilterConfig: {
                    altFormat: "F j, Y",
                    altInput: true,
                    mode: 'range'
                },
            }
        },
        computed: {

            observedPropertiesOptions (){
                return this.arr_diff (this.observedPropertiesCompleteSet, this.observedPropertiesValue);
            },



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
        created() {
            this.recievedProperty = this.$route.params.myProperty;
        },
        methods: {

            arr_diff (a1, a2) {

                var a = [], diff = [];

                for (var i = 0; i < a1.length; i++) {
                    a[a1[i]] = true;
                }

                for (var i = 0; i < a2.length; i++) {
                    if (a[a2[i]]) {
                        delete a[a2[i]];
                    } else {
                        a[a2[i]] = true;
                    }
                }

                for (var k in a) {
                    diff.push(k);
                }

                return diff;
            },

            // Starting spinner and disable the "Export CSV" button
            startProgress: function () {
                this.isLoading = true
                return this.isLoading
            },
            // Finishing spinner and enable the "Export CSV" button
            endProgress: function () {
                this.isLoading = false
                return this.isLoading
            },

            // Previewing the table
            updatePreviewTable: async function (newValue, oldValue) {
                let dataSchema = _.reduce(newValue, (result, value, key) => {
                    value.forEach(o => (result[o.display] = null));
                    return result;
                }, {});

                this.previewTableSettings.dataSchema = dataSchema;
                let columns = _.reduce(newValue, (result, value, key) => {
                    value.forEach(o => result.push({'data': o.display}));
                    return result;
                }, []);


                this.previewTableSettings.columns = columns;
                this.previewTableSettings.colHeaders = _.flatMap(newValue, entity => {
                    return entity.map(o => o.display);
                });
                this.headerColumns = _.flatMap(newValue, entity => {
                    return entity.map(o => o.display);
                });

                // Setting the data for the handsomeTable
                this.previewTableSettings.data = this.tableData;
            },


            setDownloadAction: async function () {
                await this.previewTable('download')
                return this.tableDataCSV;
            },

            setPreviewAction: function () {
                this.previewTable(this.requiredAction);
            },

            // Send request to the server for the desired data and fill the table based on response returned from the server
            // This method will show dialog based on returned error once any problems happen
            previewTable: async function (option) {
                let selectedFilters = [];

                for (var key in this.staHeadersValues) {
                    this.staHeadersValues[key].forEach(obs => {
                        selectedFilters.push({
                            'entity': obs["entity"],
                            'field': obs["field"],
                            'display': obs["display"]
                        })
                    })
                }

                // Call preview table for both "preview" and "download" mode, so if user click on "Export CSV" button without pressing "Show Preview"
                // We will have a preview of the returned data before downloading data as a CSV file
                await staRequests.getSpecificThing(this.recievedProperty, this.observedPropertiesValue, this.timeRangeFilterDate, selectedFilters, this.requiredAction).then(response => {
                    this.tableData = response[0];
                    this.statusResult = response[1];
                });

                // Showing the dialog box if any problems happened in terms of returning data from the server
                if (this.statusResult !== 'Successful') {
                    this.$refs.Unsuccessful.open()
                }
                this.updatePreviewTable(this.staHeadersValues);

                if (option === 'download') {
                    await staRequests.getSpecificThing(this.recievedProperty, this.observedPropertiesValue, this.timeRangeFilterDate, selectedFilters, option).then(response => {

                        this.tableDataCSV = response[0];
                        this.statusResult = response[1];
                    });
                }

            },
        }
    }
</script>
<style lang="scss">
    @import "~bootstrap/scss/bootstrap";

    .navbar-brand.btn-link.h2 {
        text-decoration: underline;
        margin-right:0px;
        color: blue;
    }

    .navbar-brand.btn-link.h2:hover{
        text-decoration: underline;
        color: red;
    }

    #disabled {
        pointer-events: none;
        cursor: not-allowed;
        background-color: #8bc3f4;
    }

    #enabled {
        cursor: auto;
    }

    .small-headline {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
    }

    .flatpickr-input[readonly] {
        background-color: inherit;
    }

    .handsontable.ht_clone_top {
        z-index: inherit;
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
        background-color: #0070ea !important;
    }

    .multiselect__tag-icon::after {
        color: white;
    }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
