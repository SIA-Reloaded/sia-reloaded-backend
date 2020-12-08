const { addMinutes } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');

exports.createCalendarEventHandler = async (event) => {
  console.info('event: ', event)

  const groupData = JSON.stringify(event.Records[0].dynamodb.NewImage)
  console.info('group data: ', groupData)

  const authCretendials = new google.auth.JWT(credentials.client_email,
    './suia-calendar-key.json',
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    'aldiazve@aldiazve.page'
  )

  await authCretendials.authorize();
    
  const calendar = google.calendar('v3')

  const response = await calendar.events.insert({
    auth: authCretendials,
    calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
    resource: {
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: addMinutes(new Date(), 60).toISOString(),
        timeZone: 'America/Bogota',
      },
      summary: `Clase  ${JSON.stringify(event.Records[0].dynamodb.NewImage.name)}}`,
      status: 'confirmed',
      description: `Clase ${JSON.stringify(event.Records[0].dynamodb.NewImage.name)}`,
    },
  })

  const resp = Utils.prepareResponse({ res })

  return resp;
}