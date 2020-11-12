const { addMinutes } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');

exports.createCalendarEventHandler = async (event) => {
  console.log(event)
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

  const res = await calendar.events.update({
    auth: authCretendials,
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
    calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
    // Event identifier.
    sendUpdates: 'all',
    eventId: response.id,
    // Request body metadata
    requestBody: {
      // request body parameters
      // {
      //   "anyoneCanAddSelf": false,
      //   "attachments": [],
      attendees: [...event.Records[0].dynamodb.NewImage.students, ...event.Records[0].dynamodb.NewImage.teacher],
      //   "attendeesOmitted": false,
      //   "colorId": "my_colorId",
      //   "conferenceData": {},
      //   "created": "my_created",
      //   "creator": {},
      //   "description": "my_description",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: addMinutes(new Date(), 60).toISOString(),
        timeZone: 'America/Bogota',
      },
      //   "endTimeUnspecified": false,
      //   "etag": "my_etag",
      //   "extendedProperties": {},
      //   "gadget": {},
      //   "guestsCanInviteOthers": false,
      //   "guestsCanModify": false,
      //   "guestsCanSeeOtherGuests": false,
      //   "hangoutLink": "my_hangoutLink",
      //   "htmlLink": "my_htmlLink",
      //   "iCalUID": "my_iCalUID",
      //   "id": "my_id",
      //   "kind": "my_kind",
      //   "location": "my_location",
      //   "locked": false,
      //   "organizer": {},
      //   "originalStartTime": {},
      //   "privateCopy": false,
      //   "recurrence": [],
      //   "recurringEventId": "my_recurringEventId",
      //   "reminders": {},
      //   "sequence": 0,
      //   "source": {},
      //   "start": {},
      //   "status": "my_status",
      //   "summary": "my_summary",
      //   "transparency": "my_transparency",
      //   "updated": "my_updated",
      //   "visibility": "my_visibility"
      // }
    },
  });
  
  const resp = Utils.prepareResponse({ res })

  const resp = Utils.prepareResponse({ response })

  return resp;
}