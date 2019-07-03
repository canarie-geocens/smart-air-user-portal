import convertDateBetweenTimezones from './convert-date-between-timezones'

describe('@utils/convert-date-between-timezones', () => {
  it('correctly convert dates from UTC to mountain time', () => {
    const date = '2019-01-01T18:00:00.000Z'
    const fromTimezone = 'UTC'
    const toTimezone = 'America/Edmonton'
    const mountainDate = convertDateBetweenTimezones(
      date,
      fromTimezone,
      toTimezone
    )
    expect(mountainDate.format()).toEqual('2019-01-01T11:00:00-07:00')
  })
})
