import _ from 'lodash'
import wellknown from 'wellknown'

let headers = [
  {
    code: 'thing-name',
    display: 'Thing Name',
    selectDisplay: 'Name',
    entity: 'thing',
    field: 'name',
  },
  {
    code: 'thing-description',
    display: 'Thing Description',
    selectDisplay: 'Description',
    entity: 'thing',
    field: 'description',
  },
  {
    code: 'location-name',
    display: 'Location Name',
    selectDisplay: 'Name',
    entity: 'location',
    field: 'name',
  },
  {
    code: 'location-description',
    display: 'Location Description',
    selectDisplay: 'Description',
    entity: 'location',
    field: 'description',
  },
  {
    code: 'location-encodingType',
    display: 'Location Encoding Type',
    selectDisplay: 'Encoding Type',
    entity: 'location',
    field: 'encodingType',
  },
  {
    code: 'location-location-wkt',
    display: 'Location WKT',
    selectDisplay: 'Location WKT',
    entity: 'location',
    retrieve: (location) => {
      return location.location ? wellknown.stringify(location.location) : ''
    },
  },
  {
    code: 'location-location-geojson',
    display: 'Location GeoJSON',
    selectDisplay: 'Location GeoJSON',
    entity: 'location',
    retrieve: (location) => {
      return location.location ? JSON.stringify(location.location) : ''
    },
  },
  {
    code: 'datastream-name',
    display: 'Datastream Name',
    selectDisplay: 'Name',
    entity: 'datastream',
    field: 'name',
  },
  {
    code: 'datastream-description',
    display: 'Datastream Description',
    selectDisplay: 'Description',
    entity: 'datastream',
    field: 'description',
  },
  {
    code: 'datastream-uom-name',
    display: 'Datastream Unit of Measurement Name',
    selectDisplay: 'Unit of Measurement Name',
    entity: 'datastream',
    field: 'unitOfMeasurement.name',
  },
  {
    code: 'datastream-uom-symbol',
    display: 'Datastream Unit of Measurement Symbol',
    selectDisplay: 'Unit of Measurement Symbol',
    entity: 'datastream',
    field: 'unitOfMeasurement.symbol',
  },
  {
    code: 'datastream-uom-definition',
    display: 'Datastream Unit of Measurement Definition',
    selectDisplay: 'Unit of Measurement Definition',
    entity: 'datastream',
    field: 'unitOfMeasurement.definition',
  },
  {
    code: 'observedProperty-name',
    display: 'Observed Property Name',
    selectDisplay: 'Name',
    entity: 'observedProperty',
    field: 'name',
  },
  {
    code: 'observedProperty-description',
    display: 'Observed Property Description',
    selectDisplay: 'Description',
    entity: 'observedProperty',
    field: 'description',
  },
  {
    code: 'observedProperty-definition',
    display: 'Observed Property Definition',
    selectDisplay: 'Definition',
    entity: 'observedProperty',
    field: 'definition',
  },
  {
    code: 'sensor-name',
    display: 'Sensor Name',
    selectDisplay: 'Name',
    entity: 'sensor',
    field: 'name',
  },
  {
    code: 'sensor-description',
    display: 'Sensor Description',
    selectDisplay: 'Description',
    entity: 'sensor',
    field: 'description',
  },
  {
    code: 'sensor-encodingType',
    display: 'Sensor Encoding Type',
    selectDisplay: 'Encoding Type',
    entity: 'sensor',
    field: 'encodingType',
  },
  {
    code: 'sensor-metadata',
    display: 'Sensor Metadata',
    selectDisplay: 'Metadata',
    entity: 'sensor',
    field: 'metadata',
  },
  {
    code: 'foi-name',
    display: 'Feature Of Interest Name',
    selectDisplay: 'Name',
    entity: 'featureOfInterest',
    field: 'name',
  },
  {
    code: 'foi-description',
    display: 'Feature Of Interest Description',
    selectDisplay: 'Description',
    entity: 'featureOfInterest',
    field: 'description',
  },
  {
    code: 'foi-encodingType',
    display: 'Feature Of Interest Encoding Type',
    selectDisplay: 'Encoding Type',
    entity: 'featureOfInterest',
    field: 'encodingType',
  },
  {
    code: 'foi-feature-wkt',
    display: 'Feature Of Interest WKT',
    selectDisplay: 'Feature WKT',
    entity: 'featureOfInterest',
    retrieve: (foi) => {
      return foi.feature ? wellknown.stringify(foi.feature) : ''
    },
  },
  {
    code: 'foi-feature-geojson',
    display: 'Feature Of Interest GeoJSON',
    selectDisplay: 'Feature GeoJSON',
    entity: 'featureOfInterest',
    retrieve: (foi) => {
      return foi.feature ? JSON.stringify(foi.feature) : ''
    },
  },
  {
    code: 'observation-phenomenonTime',
    display: 'Observation Phenomenon Time',
    selectDisplay: 'Phenomenon Time',
    entity: 'observation',
    field: 'phenomenonTime',
  },
  {
    code: 'observation-result',
    display: 'Observation Result',
    selectDisplay: 'Result',
    entity: 'observation',
    field: 'result',
  },
]

let table = _(headers)
  .keyBy('code')
  .value()

export default {
  headers: headers,
  table: table,
  thing: _(headers)
    .filter((header) => header.entity === 'thing')
    .value(),
  location: _(headers)
    .filter((header) => header.entity === 'location')
    .value(),
  datastream: _(headers)
    .filter((header) => header.entity === 'datastream')
    .value(),
  observedProperty: _(headers)
    .filter((header) => header.entity === 'observedProperty')
    .value(),
  sensor: _(headers)
    .filter((header) => header.entity === 'sensor')
    .value(),
  featureOfInterest: _(headers)
    .filter((header) => header.entity === 'featureOfInterest')
    .value(),
  observation: _(headers)
    .filter((header) => header.entity === 'observation')
    .value(),
  entityToPath: {
    thing: 'datastream.Thing',
    location: 'datastream.Thing.Locations[0]',
    datastream: 'datastream',
    observedProperty: 'datastream.ObservedProperty',
    sensor: 'datastream.Sensor',
    featureOfInterest: 'observation.FeatureOfInterest',
    observation: 'observation',
  },
}
