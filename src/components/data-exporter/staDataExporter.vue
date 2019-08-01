<template>
  <download-excel
    :fetch="cbFunction"
    :fields="jsonFields"
    :type="type"
    :name="fileName"
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
  methods: {
    beforLoading() {
      // before-generate
      alert('show loading')
    },
    finish() {
      // before-finish
      alert('finish')
    },
  },
}
</script>
