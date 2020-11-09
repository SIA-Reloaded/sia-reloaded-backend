const { addWeeks } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');

exports.createCalendarEventHandler = async (event) => {
  const authCretendials = new google.auth.JWT(credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar']
  )

  const auth = await authCretendials.authorize();

  const calendar = google.calendar('v3')

  const response = await calendar.events.list({
    auth: authCretendials,
    calendarId: 'sun120ggavucgf5aaj6s4f8i0g@group.calendar.google.com',
    timeMin: new Date().toISOString(),
    timeMax: addWeeks(new Date(), 1).toISOString(), // Let's get events for one week
    singleEvents: true,
    orderBy: 'startTime',
  })

  const appointments = response.data.items.map((appointment) => ({
    start: appointment.start.dateTime || appointment.start.date,
    end: appointment.end.dateTime || appointment.end.date,
    id: appointment.id,
    status: appointment.status,
    creator: appointment.creator,
    description: appointment.description,
  }))

  const resp = Utils.prepareResponse({appointments})

  return resp;
}