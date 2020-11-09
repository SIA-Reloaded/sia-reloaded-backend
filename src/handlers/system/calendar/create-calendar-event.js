const { addMinutes } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');

exports.createCalendarEventHandler = async (event) => {
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
    attendees: [
      {'email': 'aldiazve@unal.edu.co'},
      {'email': 'aldiazve@gmail.com'},
      {'email': 'csantosr@unal.edu.co'},
      {'email': 'aldiazve@aldiazve.page'},
    ],
    resource: {
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: addMinutes(new Date(), 60).toISOString(),
        timeZone: 'America/Bogota',
      },
      summary: 'Test event',
      status: 'confirmed',
      description: 'Test description',
    },
  })

  const resp = Utils.prepareResponse({ response })

  return resp;
}