import moment from 'moment-timezone'

export default function convertDateBetweenTimezones(
  date,
  fromTimeZone,
  toTimeZone
) {
  return moment.tz(date, fromTimeZone).tz(toTimeZone)
}
