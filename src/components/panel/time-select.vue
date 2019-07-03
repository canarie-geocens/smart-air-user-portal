<template>
  <div
    id="reportrange"
    style="background: #fff; cursor: pointer; padding: 4px 10px; width: 100%"
  >
    <calendar-icon />&nbsp;
    <span>{{ start }} - {{ end }}</span>
  </div>
</template>

<script>
import 'daterangepicker/daterangepicker.js'
import { CalendarIcon } from 'vue-feather-icons'

export default {
  components: {
    CalendarIcon,
  },
  props: {
    dateTimeValue: {
      type: Array,
      default() {
        return []
      },
    },
    dateTimeFormat: {
      type: String,
      default: 'lll',
    },
  },
  data() {
    return {
      start: '',
      end: '',
    }
  },
  computed: {},
  mounted() {
    // set the datetime picker datetime

    $('#reportrange').daterangepicker(
      {
        timePicker: true,
        startDate: this.$moment().subtract(1, 'days'),
        endDate: this.$moment(),
        maxDate: this.$moment(),
        minDate: this.$moment('2019-04-04'),
        ranges: {
          Today: [this.$moment().startOf('d'), this.$moment()],
          'Last 3 hours': [this.$moment().subtract(3, 'h'), this.$moment()],
          'Last 8 hours': [this.$moment().subtract(8, 'h'), this.$moment()],
          'Last 1 Days': [this.$moment().subtract(1, 'd'), this.$moment()],
          'Last 3 Days': [this.$moment().subtract(3, 'd'), this.$moment()],
        },
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        locale: {
          format: this.dateTimeFormat,
        },
      },
      this.daterangepickerChange
    )
  },
  methods: {
    daterangepickerChange(start, end) {
      this.start = start.format('LLL')
      this.end = end.format('LLL')
      this.$emit('update:dateTimeValue', [this.start, this.end])
    },
  },
}
</script>

<style src="daterangepicker/daterangepicker.css"></style>
