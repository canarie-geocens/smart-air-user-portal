<template>
  <download-excel
    :fetch="cbFunction"
    :fields="jsonFields"
    :type="type"
    :name="fileName"
    :before-generate="beforeLoading"
    :before-finish="afterLoading"
  >
    <span> Export CSV</span>
  </download-excel>
</template>

<script>
import DownloadExcel from 'vue-json-excel'
export default {
  name: 'StaDataExporter',
  components: {
    DownloadExcel,
  },
  props: {
    cbFunction: {
      type: Function,
      required: true,
    },
    beforeLoading: {
      type: Function,
      required: true,
    },
    afterLoading: {
      type: Function,
      required: true,
    },
    jsonFields: {
      type: Object,
      required: true,
    },
    jsonData: {
      type: Array,
      default() {
        return []
      },
    },
    jsonMeta: {
      type: Array,
      default() {
        return [
          [
            {
              key: 'charset',
              value: 'utf-8',
            },
          ],
        ]
      },
    },
    title: {
      type: String,
      default: 'Example CSV',
    },
    name: {
      type: String,
      default: 'asset_history_data',
    },
    type: {
      type: String,
      default: 'csv',
    },
    icon: {
      type: String,
      default: 'fa-file-export',
    },
  },
  computed: {
    fileName() {
      return this.name + '.' + this.type
    },
  },
}
</script>
