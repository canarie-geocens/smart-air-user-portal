import _ from 'lodash'

let headers = [
  {
    code: 'thing-name',
    display: 'Thing Name',
    entity: 'thing',
    field: 'name',
  },
  {
    code: 'thing-description',
    display: 'Thing Description',
    entity: 'thing',
    field: 'description',
  },
  {
    code: 'location-name',
    display: 'Location Name',
    entity: 'location',
    field: 'name',
  },
  {
    code: 'location-description',
    display: 'Location Description',
    entity: 'location',
    field: 'description',
  },
  {
    code: 'location-encodingType',
    display: 'Location Encoding Type',
    entity: 'location',
    field: 'encodingType',
  },
  {
    code: 'location-location-geojson',
    display: 'Location GeoJSON',
    entity: 'location',
  },
  {
    code: 'datastream-name',
    display: 'Datastream Name',
    entity: 'datastream',
    field: 'name',
  },
  {
    code: 'datastream-description',
    display: 'Datastream Description',
    entity: 'datastream',
    field: 'description',
  },
  {
    code: 'datastream-uom-name',
    display: 'Datastream Unit of Measurement Name',
    entity: 'datastream',
    field: 'unitOfMeasurement.name',
  },
  {
    code: 'datastream-uom-symbol',
    display: 'Datastream Unit of Measurement Symbol',
    entity: 'datastream',
    field: 'unitOfMeasurement.symbol',
  },
  {
    code: 'datastream-uom-definition',
    display: 'Datastream Unit of Measurement Definition',
    entity: 'datastream',
    field: 'unitOfMeasurement.definition',
  },
  {
    code: 'observedProperty-name',
    display: 'Observed Property Name',
    entity: 'observedProperty',
    field: 'name',
  },
  {
    code: 'observedProperty-description',
    display: 'Observed Property Description',
    entity: 'observedProperty',
    field: 'description',
  },
  {
    code: 'observedProperty-definition',
    display: 'Observed Property Definition',
    entity: 'observedProperty',
    field: 'definition',
  },
  {
    code: 'sensor-name',
    display: 'Sensor Name',
    entity: 'sensor',
    field: 'name',
  },
  {
    code: 'sensor-description',
    display: 'Sensor Description',
    entity: 'sensor',
    field: 'description',
  },
  {
    code: 'sensor-encodingType',
    display: 'Sensor Encoding Type',
    entity: 'sensor',
    field: 'encodingType',
  },
  {
    code: 'sensor-metadata',
    display: 'Sensor Metadata',
    entity: 'sensor',
    field: 'metadata',
  },
  {
    code: 'foi-name',
    display: 'Feature Of Interest Name',
    entity: 'featureOfInterest',
    field: 'name',
  },
  {
    code: 'foi-description',
    display: 'Feature Of Interest Description',
    entity: 'featureOfInterest',
    field: 'description',
  },
  {
    code: 'foi-encodingType',
    display: 'Feature Of Interest Encoding Type',
    entity: 'featureOfInterest',
    field: 'encodingType',
  },
  {
    code: 'foi-feature-geojson',
    display: 'Feature Of Interest GeoJSON',
    entity: 'featureOfInterest',
  },
  {
    code: 'observation-phenomenonTime',
    display: 'Observation Phenomenon Time',
    entity: 'observation',
    field: 'phenomenonTime',
  },
  {
    code: 'observation-result',
    display: 'Observation Result',
    entity: 'observation',
    field: 'result',
  },
]

let table = _(headers)
  .keyBy('code')
  .value()

export default {
  table,
}
