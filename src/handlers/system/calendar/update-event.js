const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');
const { parseJSON } = require('date-fns');
const AWS = require("aws-sdk");

exports.updateCalendarEventHandler = async (event) => {
  console.info('event: ', event)
  const groupData = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.NewImage)
  console.info("data: ", groupData)
  console.info("schedule: ", groupData.schedule)

  let days = '';

  groupData.schedule.forEach(session => {
    days += `${session.day},`
  });

  console.info('days: ', days)

  const repeatEventString = `RRULE:FREQ=WEEKLY;COUNT=16;WKST=MO;BYDAY=${days}`

  console.info('repeatEventString: ', repeatEventString)

  const startHours = parseInt(groupData.schedule[0].startHours.split(':')[0])
  const endHours = parseInt(groupData.schedule[0].endHours.split(':')[0])

  const startDate = new Date(2020, 11, 14, startHours, 0, 0)
  const endDate = new Date(2020, 11, 14, endHours, 0, 0)

  console.info('startDate: ', startDate)
  console.info('endDate: ', endDate)

  const studentsEmails = []
  const teachersEmails = []

  if (groupData.studentsUserNames) groupData.studentsUserNames.forEach(student => {
    studentsEmails.push(`${student}@unal.edu.co`)
  });

  if (groupData.teachersUsernames) groupData.teachersUsernames.forEach(teacher => {
    teachersEmails.push(`${teacher}@unal.edu.co`)
  });

  const attendees = [...studentsEmails, ...teachersEmails]

  console.info('attendees: ', attendees)

  const authCretendials = new google.auth.JWT(credentials.client_email,
    './suia-calendar-key.json',
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
    'aldiazve@aldiazve.page'
  )

  await authCretendials.authorize();

  const calendar = google.calendar('v3')
  const res = await calendar.events.patch({
    auth: authCretendials,
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently infoged in user, use the "primary" keyword.
    calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
    // Event identifier.
    sendUpdates: 'all',
    eventId: groupData.calendarEventData.id,
    requestBody: {
      attendees,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota',
      },
    },
    recurrence: [repeatEventString],
  });



  console.info('calendar patch: ', res.body);
  
  const resp = Utils.prepareResponse(res.body)

  return resp;
}