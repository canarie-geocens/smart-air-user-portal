import axios from 'axios'
import moment from 'moment';
import wellknown from "wellknown";

const staURL = 'https://canada-geocens-aq-sta.sensorup.com/v1.0'
const _ = require('lodash');

let requests = {


    observations: async function (staClient, thingsId, filters, headers, options) {
        options = options || {};
        // options.progress = options.progress || {};

        // let thingsIdSet = new Set(filters.thing.map(thing => thing['@iot.id']));
        // let observedPropertiesIdSet = new Set(filters.observedProperty.map(op => op['@iot.id']));
        let timeRangeMomentArray = filters.timeRange && _.includes(filters.timeRange, ' to ') ? filters.timeRange.split(' to ').map(date => moment(date)) : null;
        let hasFeatureOfInterestHeaders = _.filter(headers, header => header.entity === 'featureOfInterest').length > 0;

        let datastreams = (await staClient.getEntities('datastream', {
            retrieveAll: true,
            query: {
                '$expand': 'Thing/Locations,ObservedProperty,Sensor',
                '$filter': timeRangeMomentArray ? `Datastreams/Observations/phenomenonTime ge ${timeRangeMomentArray[0].toISOString()} and Datastreams/Observations/phenomenonTime le ${timeRangeMomentArray[1].endOf('day')
                        .toISOString()} and properties/deviceId eq '${thingsId}' and Datastreams/ObservedProperty/name eq 'humidity'`
                    : null,
            }
        })).value;
        // datastreams = datastreams.filter(d => {
        //     if (thingsIdSet.size > 0) {
        //         if (!thingsIdSet.has(d.Thing['@iot.id'])) {
        //             return false;
        //         }
        //     }
        //     if (observedPropertiesIdSet.size > 0) {
        //         if (!observedPropertiesIdSet.has(d.ObservedProperty['@iot.id'])) {
        //             return false;
        //         }
        //     }
        //     return true;
        // });

    }
}


export default {

    requests,
    requiredAction : 'download',
    requiredFOI : false,
    requiredDataStreams: false,
    requiredObservations: false,
    requiredSensors: false,
    requiredObservedProperties: false,
    async getSpecificThing(thingsId, obsrvedProperttyArray, timeRange, selectedFilters,option) {
        this.requiredAction = option;
        selectedFilters.forEach(filter => {
            switch (filter.entity) {
                case "featureOfInterest":
                    this.requiredFOI = true;
                    break;
                case "datastream":
                    this.requiredDataStreams = true;
                    break;
                case "observation":
                    this.requiredObservations = true;
                    break;
                case "sensor":
                    this.requiredSensors = true;
                    break;
                case "observedProperty":
                    this.requiredObservedProperties = true;
                    break;
            }
        })

        let returnedData = [];
        let returnedRecord = {};
        let key = [];

        let datastreamIds = {}
        let specificThing = await axios.get(
            `${staURL}/Things?$filter=properties/deviceId eq '${thingsId}'&$expand=Datastreams,Locations,Datastreams/ObservedProperty,Datastreams/Sensor`
        )

        selectedFilters.forEach(i => {
            key.push(i['display'])

        })

        key.forEach(selectedFilter => {
            switch (selectedFilter) {
                case 'Thing Name':
                    returnedRecord[selectedFilter] = specificThing.data.value[0].name;
                    break;
                case 'Thing Description':
                    returnedRecord[selectedFilter] = specificThing.data.value[0].description;
                    break;
                case 'Location Name':
                    returnedRecord[selectedFilter] = specificThing.data.value[0]['Locations'][0].name;
                    break;
                case 'Location Description':
                    returnedRecord[selectedFilter] = specificThing.data.value[0]['Locations'][0].description;
                    break;
                case 'Location Encoding Type':
                    returnedRecord[selectedFilter] = specificThing.data.value[0]['Locations'][0].encodingType;
                    break;
                case 'Location WKT':
                    returnedRecord[selectedFilter] = specificThing.data.value[0]['Locations'][0].location ? wellknown.stringify(specificThing.data.value[0]['Locations'][0].location) : '';
                    break;
                case 'Location GeoJSON': {
                    returnedRecord[selectedFilter] = specificThing.data.value[0]['Locations'][0].location ? JSON.stringify(specificThing.data.value[0]['Locations'][0].location) : '';
                    break;
                }
                // case 'Thing Description':
                //     returnedRecord[selectedFilter] = specificThing.data.value[0].description;
                //     break;
                // case 'Thing Description':
                //     returnedRecord[selectedFilter] = specificThing.data.value[0].description;
                //     break;
            }
        });

        // returnedData.push(returnedRecord)


        // To return Datasteam Ids, filtered or selected by the user
        let datastreams = specificThing.data.value[0].Datastreams;

        if (obsrvedProperttyArray.length === 0) {
            obsrvedProperttyArray = ["Humidity", "Temperature", "PM2.5"]
        }
        obsrvedProperttyArray.forEach(opv => {
            let dtsId = null
            datastreams.forEach(obj => {
                let strName = obj.name
                if (strName.includes(opv)) {
                    dtsId = obj['@iot.id']
                }
            });
            datastreamIds[opv] = dtsId
        })

        let timeRangeMomentArray = timeRange && _.includes(timeRange, ' to ') ? timeRange.split(' to ').map(date => moment(date)) : null;
        for (var dId in datastreamIds) {
            // if(this.requiredFOI){
            //     this.getFeatureOfInterest(datastreamIds[dId],timeRangeMomentArray,selectedFilters);
            // }
            if (datastreamIds.hasOwnProperty(dId)) {
                let obsJSON = await axios.get(
                    `${staURL}/Datastreams(${datastreamIds[dId]})/Observations`,
                    {
                        params: {
                            $count: false,
                            $filter: timeRangeMomentArray ? `Datastreams/Observations/phenomenonTime ge ${timeRangeMomentArray[0].toISOString()} and Datastreams/Observations/phenomenonTime le ${timeRangeMomentArray[1].endOf('day').toISOString()}`
                                : null,
                            // $top: 10, //check
                            $top: this.requiredAction === 'download' ? 2000 : 10,
                            $expand: 'FeatureOfInterest,Datastream,Datastream/Sensor,Datastream/ObservedProperty'
                        },
                    }
                )
                let observations = obsJSON.data.value;
                let requiredPhenomenonTime = false;
                let requiredresult = false;
                key.forEach(selectedFilter => {
                    switch (selectedFilter) {
                        case 'Observation Phenomenon Time':
                            requiredPhenomenonTime = !requiredPhenomenonTime;
                            break;
                        case 'Observation Result':
                            requiredresult = !requiredresult;
                            break;
                    }
                });
                if (requiredPhenomenonTime && !requiredresult) {
                      observations.forEach(obs => {
                          var returnedRecordTemp = {};
                          var foiTemp = {};
                          var datastreamTemp = {};
                          var sensorTemp = {};
                          var observedPropertiesTemp = {};
                          returnedRecordTemp['Observation Phenomenon Time'] = obs.phenomenonTime;
                          returnedRecordTemp['Observed Property Name'] = dId;
                          if(this.requiredFOI){
                              foiTemp = this.getFeatureOfInterest(obs,selectedFilters)
                          }

                          if(this.requiredDataStreams){
                              datastreamTemp = this.getDatastream(obs,selectedFilters)
                          }

                          if(this.requiredSensors){
                              sensorTemp = this.getSensor(obs,selectedFilters)
                          }

                          if(this.requiredObservedProperties){
                              observedPropertiesTemp = this.getObservedProperties(obs,selectedFilters)
                          }

                          var computedObj = {...returnedRecordTemp,...returnedRecord,...foiTemp,...datastreamTemp,...sensorTemp,...observedPropertiesTemp}

                          returnedData.push(computedObj)
                      });
                }
                else if (!requiredPhenomenonTime && requiredresult){
                    observations.forEach(obs => {
                        var returnedRecordTemp = {}
                        var foiTemp = {};
                        var datastreamTemp = {};
                        var sensorTemp = {};
                        var observedPropertiesTemp = {};
                        returnedRecordTemp['Observation Result'] = obs.result;
                        returnedRecordTemp['Observed Property Name'] = dId;
                        if(this.requiredFOI){
                            foiTemp = this.getFeatureOfInterest(obs,selectedFilters)
                        }
                        if(this.requiredDataStreams){
                            datastreamTemp = this.getDatastream(obs,selectedFilters)
                        }

                        if(this.requiredSensors){
                            sensorTemp = this.getSensor(obs,selectedFilters)
                        }

                        if(this.requiredObservedProperties){
                            observedPropertiesTemp = this.getObservedProperties(obs,selectedFilters)
                        }

                        var computedObj = {...returnedRecordTemp,...returnedRecord,...foiTemp,...datastreamTemp,...sensorTemp,...observedPropertiesTemp}

                        returnedData.push(computedObj)

                    });
                }else if (requiredPhenomenonTime && requiredresult) {
                    observations.forEach(obs => {
                        var returnedRecordTemp = {}
                        var foiTemp = {};
                        var datastreamTemp = {};
                        var sensorTemp = {};
                        var observedPropertiesTemp = {};
                        returnedRecordTemp['Observation Phenomenon Time'] = obs.phenomenonTime;
                        returnedRecordTemp['Observation Result'] = obs.result;
                        returnedRecordTemp['Observed Property Name'] = dId;

                        if(this.requiredFOI){
                            foiTemp = this.getFeatureOfInterest(obs,selectedFilters)
                        }
                        if(this.requiredDataStreams){
                            datastreamTemp = this.getDatastream(obs,selectedFilters)
                        }

                        if(this.requiredSensors){
                            sensorTemp = this.getSensor(obs,selectedFilters)
                        }

                        if(this.requiredObservedProperties){
                            observedPropertiesTemp = this.getObservedProperties(obs,selectedFilters)
                        }

                        var computedObj = {...returnedRecordTemp,...returnedRecord,...foiTemp,...datastreamTemp,...sensorTemp,...observedPropertiesTemp}
                        returnedData.push(computedObj)
                    });
                }

            }
        }
        return returnedData

    },

    getObservedProperties(observation,selectedFilters){
        let observedProperty ={}
        selectedFilters.forEach(filter => {
            switch(filter.display){
                case 'Observed Property Name':
                    observedProperty[filter.display] = observation.Datastream.ObservedProperty.name
                    break;
                case 'Observed Property Description':
                    observedProperty[filter.display] = observation.Datastream.ObservedProperty.description
                    break;
                case 'Observed Property Definition':
                    observedProperty[filter.display] = observation.Datastream.ObservedProperty.definition
                    break;

            }
        })
        return observedProperty
    },

    getSensor(observation,selectedFilters){
        let sensorObject ={}
        selectedFilters.forEach(filter => {
            switch(filter.display){
                case 'Sensor Name':
                    sensorObject[filter.display] = observation.Datastream.Sensor.name
                    break;
                case 'Sensor Description':
                    sensorObject[filter.display] = observation.Datastream.Sensor.description
                    break;
                case 'Sensor Encoding Type':
                    sensorObject[filter.display] = observation.Datastream.Sensor.encodingType
                    break;
                case 'Sensor Metadata':
                    sensorObject[filter.display] = observation.Datastream.Sensor.metadata
                    break;
            }
        })
        return sensorObject
    },

    getDatastream(observation,selectedFilters){
        let datastreamObject ={}
        selectedFilters.forEach(filter => {
            switch(filter.display){
                case 'Datastream Name':
                    datastreamObject[filter.display] = observation.Datastream.name
                    break;
                case 'Datastream Description':
                    datastreamObject[filter.display] = observation.Datastream.description
                    break;
                case 'Datastream Unit of Measurement Name':
                    datastreamObject[filter.display] = observation.Datastream.unitOfMeasurement.name
                    break;
                case 'Datastream Unit of Measurement Symbol':
                    datastreamObject[filter.display] = observation.Datastream.unitOfMeasurement.symbol
                    break;
                case 'Datastream Unit of Measurement Definition':
                    datastreamObject[filter.display] = observation.Datastream.unitOfMeasurement.definition
                    break;

            }
        })
        return datastreamObject
    },

    getFeatureOfInterest(observation,selectedFilters){
         let foiObject ={}

        selectedFilters.forEach(filter => {
            switch(filter.display){
                case 'Feature Of Interest Name':
                    foiObject[filter.display] = observation.FeatureOfInterest.name
                    break;
                case 'Feature Of Interest Description':
                    foiObject[filter.display] = observation.FeatureOfInterest.description
                    break;
                case 'Feature Of Interest Encoding Type':
                    foiObject[filter.display] = observation.FeatureOfInterest.encodingType
                    break;
                case 'Feature Of Interest WKT':
                    foiObject[filter.display] = observation.FeatureOfInterest.feature ? wellknown.stringify(observation.FeatureOfInterest.feature) : '';
                    break;
                case 'Feature Of Interest GeoJSON':
                    foiObject[filter.display] = observation.FeatureOfInterest.feature ? JSON.stringify(observation.FeatureOfInterest.feature) : '';
                    break;

            }
        })
        return foiObject
    },


    // getThingsList() {
    //     return axios.get(`${staURL}/Things`)
    // },
    //
    // getObservations(datastreamId) {
    //     let observations = axios.get(
    //         `${staURL}/Datastreams(${datastreamId})/Observations`
    //     )
    //     return observations
    // },
    // getThingsName(datastreamId) {
    //     let Thing = axios.get(
    //         `${staURL}/Datastreams(${datastreamId})/Thing`
    //     )
    //     return Thing
    // },
    // getObservedProperty(datastreamId) {
    //     let ObservedProperty = axios.get(
    //         `${staURL}/Datastreams(${datastreamId})/ObservedProperty`
    //     )
    //     return ObservedProperty
    // },
    // async getTest(thingsId, obsrvedProperttyArray) {
    //     // let timeRangeMomentArray = timeRange && _.includes(timeRange, ' to ') ? timeRange.split(' to ').map(date => moment(date)) : null;
    //     //
    //     // let specificThing = axios.get(
    //     //     `${staURL}/Things`,{
    //     //         params: {
    //     //             $expand:
    //     //                 'Datastreams/Observations($top=30),Datastreams/Observations/FeatureOfInterest,Datastreams/ObservedProperty',
    //     //             $filter: timeRangeMomentArray ? `Datastreams/Observations/phenomenonTime ge ${timeRangeMomentArray[0].toISOString()} and Datastreams/Observations/phenomenonTime le ${timeRangeMomentArray[1].endOf('day').toISOString()} and properties/deviceId eq '${ thingsId }'`
    //     //                 : null,
    //     //         },
    //     //     })
    //     // // `${staURL}/Things?$filter=properties/deviceId eq '${thingsId}'&$expand=Datastreams/Observations,Datastreams/Observations/FeatureOfInterest,Datastreams/ObservedProperty`
    //     // return specificThing
    //
    //
    //     let datastreamIds = {}
    //     let specificThing = await axios.get(
    //         `${staURL}/Things?$filter=properties/deviceId eq '${thingsId}'&$expand=Datastreams`
    //     )
    //     let datastreams = specificThing.data.value[0].Datastreams;
    //
    //
    //     if (obsrvedProperttyArray) {
    //         obsrvedProperttyArray.forEach(opv => {
    //             let dtsId = null
    //             datastreams.forEach(obj => {
    //                 let strName = obj.name
    //                 if (strName.includes(opv)) {
    //                     dtsId = obj['@iot.id']
    //                 }
    //             });
    //             datastreamIds[opv] = dtsId
    //         })
    //     }
    //     return datastreamIds
    //
    // }

}
