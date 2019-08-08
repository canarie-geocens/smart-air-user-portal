import axios from 'axios'
import moment from 'moment';

const staURL = process.env.VUE_APP_STA_URL
const badRequest = 'Something in your request is not correct. It could be the content of the JSON or it could be the server endpoint is not expecting this content'
const notFound = 'The resource you are looking for does not exist on the system'
const internalServerError = 'We had a problem with our server. Try again later'
const serviceUnavailable = 'We’re temporarially offline for maintanance. Please try again later'
const _ = require('lodash');

export default {

    statusCode: 0,
    requiredAction: 'download',
    requiredFOI: false,
    requiredDataStreams: false,
    requiredObservations: false,
    requiredSensors: false,
    requiredObservedProperties: false,

    async getSpecificThing(thingsId, obsrvedProperttyArray, timeRange, selectedFilters, option) {

        this.requiredAction = option;
        this.setRequiredInformation(selectedFilters);
        let timeRangeMomentArray = timeRange && _.includes(timeRange, ' to ') ? timeRange.split(' to ').map(date => moment(date)) : null;
        let returnedData = [];
        let thingsRelatedEntityObject = {};
        let key = [];
        let datastreamIds = {}

        let specificThing = await axios.get(
            `${staURL}/Things?$filter=properties/deviceId eq '${thingsId}'&$expand=Datastreams,Locations,Datastreams/ObservedProperty,Datastreams/Sensor`
        );

        this.statusCode = specificThing.status // Error handling

        if (this.statusCode === 200) { // Response is successfully returned
            selectedFilters.forEach(i => {
                key.push(i['display'])

            })

            thingsRelatedEntityObject = this.returnThingsRelatedEntities(specificThing,key);

            let datastreams = specificThing.data.value[0].Datastreams; // Return all the datastreams for each Thing for example some Thing object might have one ,two, or three datastreams

            // If user unselect all of observed properties, all of them will be considered.
            if (obsrvedProperttyArray.length === 0) {
                obsrvedProperttyArray = ["Humidity", "Temperature", "PM2.5"]
            }

            datastreamIds = this.setDatastreamIDs(obsrvedProperttyArray, datastreams);

            // Returning observations for each datastream
            for (var dId in datastreamIds) {
                if (datastreamIds.hasOwnProperty(dId)) {

                    let observations = await this.returnObservation(datastreamIds, dId, timeRangeMomentArray);
                    observations.forEach(obs => {

                        let observationObject = this.observationCreatedObject(obs, dId, selectedFilters);
                        var computedObj = {...observationObject, ...thingsRelatedEntityObject}
                        returnedData.push(computedObj)

                    });

                }
            }

            return [returnedData, "Successful"]
        } else if (this.statusCode === 400) {
            return [null, badRequest]
        } else if (this.statusCode === 404) {
            return [null, notFound]
        } else if (this.statusCode === 500) {
            return [null, internalServerError]
        } else if (this.statusCode === 503) {
            return [null, serviceUnavailable]
        }
    },

    // Returning Things related Entities
    returnThingsRelatedEntities(specificThing,key){
        let thingsRelatedObject = {}
        key.forEach(selectedFilter => {

            // Returning const values for each observation such as thing name for PM2.5 observation
            switch (selectedFilter) {
                case 'Location Name':
                    thingsRelatedObject[selectedFilter] = specificThing.data.value[0]['Locations'][0].name;
                    break;
                case 'Location Description':
                    thingsRelatedObject[selectedFilter] = specificThing.data.value[0]['Locations'][0].description;
                    break;
                case 'Location GeoJSON': {

                    thingsRelatedObject[selectedFilter] = specificThing.data.value[0]['Locations'][0].location ? JSON.stringify(specificThing.data.value[0]['Locations'][0].location) : '';
                    // thingsRelatedObject[selectedFilter] = specificThing.data.value[0]['Locations'][0].location ? JSON.stringify(specificThing.data.value[0]['Locations'][0].location['coordinates']) : '';
                    break;
                }
            }

        });

        return thingsRelatedObject;
    },

    // Creating an object with required information extracted from each observation for the specific datastream ID
    observationCreatedObject(observation, dId, selectedFilters) {
        var returnedRecordTemp = {}
        var foiTemp = {};
        var datastreamTemp = {};
        var sensorTemp = {};
        var observedPropertiesTemp = {};

        returnedRecordTemp['Observation Phenomenon Time'] = observation.phenomenonTime;
        returnedRecordTemp['Observation Result'] = observation.result;

        if (this.requiredFOI) {
            foiTemp = this.getFeatureOfInterest(observation, selectedFilters)
        }
        if (this.requiredDataStreams) {
            datastreamTemp = this.getDatastream(observation, selectedFilters)
        }

        if (this.requiredSensors) {
            sensorTemp = this.getSensor(observation, selectedFilters)
        }

        if (this.requiredObservedProperties) {
            observedPropertiesTemp = this.getObservedProperties(observation, selectedFilters)
        }
        return {...returnedRecordTemp, ...observedPropertiesTemp, ...datastreamTemp, ...foiTemp,...sensorTemp}

    },

    // Returning observations for each datastream
    async returnObservation(datastreamIds, specificID, timeRangeMomentArray) {
        let obsJSON = await axios.get(
            `${staURL}/Datastreams(${datastreamIds[specificID]})/Observations`,
            {
                params: {
                    $count: false,
                    $filter: timeRangeMomentArray ? `phenomenonTime ge ${timeRangeMomentArray[0].subtract(6,'hours').toISOString()} and phenomenonTime le ${timeRangeMomentArray[1].endOf('day').subtract(6,'hours').toISOString()}`
                        : null,
                    // $top: 10,
                    $top: this.requiredAction === 'download' ? 2000 : 10, // For preview mode we just show the 10 latest observations while for download mode 2000 observations will be selected
                    $expand: 'FeatureOfInterest,Datastream,Datastream/Sensor,Datastream/ObservedProperty'
                },
            }
        )

        return obsJSON.data.value;
    },

    // Finding datastreams' Id for each of selected observed properties {Humidity, Temperature, and pm2.5
    setDatastreamIDs(obsrvedProperttyArray, datastreams) {
        const datastreamIds = {};
        obsrvedProperttyArray.forEach(opv => {
            let dtsId = null
            datastreams.forEach(obj => {
                let strName = obj.name
                if (strName.includes(opv)) {
                    dtsId = obj['@iot.id'] // Return the ID of each selected datastream, e.g., return 123 for datastream related to the temperature
                }
            });
            datastreamIds[opv] = dtsId // Store all the three or selected datastreamIds for the selected observed properties
        });
        return datastreamIds;

    },

    // Setting the required information
    setRequiredInformation(selectedFilters) {
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
        });
    },

    // To return desired values stored on the "ObservedProperties"
    getObservedProperties(observation, selectedFilters) {
        let observedProperty = {}
        selectedFilters.forEach(filter => {
            switch (filter.display) {
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

    // To return desired values stored on the "Sensor"
    getSensor(observation, selectedFilters) {
        let sensorObject = {}
        selectedFilters.forEach(filter => {
            switch (filter.display) {
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

    // To return desired values stored on the "Observation/Datastream"
    getDatastream(observation, selectedFilters) {
        let datastreamObject = {}
        selectedFilters.forEach(filter => {
            switch (filter.display) {
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

    // To return desired values stored on the "FeatureOfInterest"
    getFeatureOfInterest(observation, selectedFilters) {
        let foiObject = {}

        selectedFilters.forEach(filter => {
            switch (filter.display) {
                case 'Feature Of Interest Name':
                    foiObject[filter.display] = observation.FeatureOfInterest.name
                    break;
                case 'Feature Of Interest Description':
                    foiObject[filter.display] = observation.FeatureOfInterest.description
                    break;
                case 'Feature Of Interest Encoding Type':
                    foiObject[filter.display] = observation.FeatureOfInterest.encodingType
                    break;
                case 'Feature Of Interest GeoJSON': {
                    var obf = JSON.stringify(observation.FeatureOfInterest.feature);
                    if (obf.includes("=")) {
                        obf = obf.substring(1, obf.length);

                    }
                    foiObject[filter.display] = observation.FeatureOfInterest.feature ? obf : '';
                }
                    break;

            }
        })
        return foiObject
    },

}
