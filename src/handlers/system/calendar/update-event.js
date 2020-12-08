const { addMinutes } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');

exports.updateCalendarEventHandler = async (event) => {
  console.log(event)
  /*
  const authCretendials = new google.auth.JWT(credentials.client_email,
    './suia-calendar-key.json',
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    'aldiazve@aldiazve.page'
  )

  await authCretendials.authorize();

  const calendar = google.calendar('v3')
  const res = await calendar.events.update({
    auth: authCretendials,
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
    calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
    // Event identifier.
    sendUpdates: 'all',
    eventId: 'g8bnuca3g0ndmlojlds2lf74q0',
    requestBody: {
      attendees: [
        {'email': 'aldiazve@unal.edu.co'},
        {'email': 'aldiazve@gmail.com'},
        {'email': 'csantosr@unal.edu.co'},
        {'email': 'aldiazve@aldiazve.page'},
      ],
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: addMinutes(new Date(), 60).toISOString(),
        timeZone: 'America/Bogota',
      },
    },
  });
  
  const resp = Utils.prepareResponse({ res })
  */
  return {status: 200};
}