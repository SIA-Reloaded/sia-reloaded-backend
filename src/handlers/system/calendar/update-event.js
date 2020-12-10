const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json')
const Utils = require('../../../utils');
const AWS = require("aws-sdk");

const DayToNumber = {
  MO: 14,
  TU: 15,
  WE: 16,
  TH: 17,
  FR: 18,
  SA: 19,
  SU: 20,
}

exports.updateCalendarEventHandler = async (event) => {
  console.info('event: ', event)
  const groupData = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.NewImage)

  event.Records.forEach((record) => {
    console.log('record: ', AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage))
  })

  console.info("data: ", groupData)
  console.info("schedule: ", groupData.schedule)

  let days = '';

  groupData.schedule.forEach(session => {
    days += `${session.day},`
  });

  console.info('days: ', days)

  const repeatEventString = `RRULE:FREQ=WEEKLY;COUNT=16;BYDAY=${days}`

  console.info('repeatEventString: ', repeatEventString)

  const startHours = parseInt(groupData.schedule[0].startHours.split(':')[0])
  const endHours = parseInt(groupData.schedule[0].endHours.split(':')[0])

  const startDate = new Date(2020, 11, DayToNumber[groupData.schedule[0].day], startHours, 0, 0)
  const endDate = new Date(2020, 11, DayToNumber[groupData.schedule[0].day], endHours, 0, 0)

  console.info('startDate: ', startDate)
  console.info('endDate: ', endDate)

  const studentsEmails = []
  const teachersEmails = []

  if (groupData.studentsUserNames) groupData.studentsUserNames.forEach(student => {
    studentsEmails.push({email: `${student}@unal.edu.co`})
  });

  if (groupData.teachersUsernames) groupData.teachersUsernames.forEach(teacher => {
    teachersEmails.push({email: `${teacher}@unal.edu.co`})
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

  const resource = {
    attendees,
    start: {
      dateTime: startDate.toISOString().slice(0, -1),
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: endDate.toISOString().slice(0, -1),
      timeZone: 'America/Bogota',
    },
    timeZone: 'America/Bogota',
    summary: `Clase de ${groupData.name}`,
    status: 'confirmed',
    description: `Clase de ${groupData.name} - ${groupData.code} grupo ${groupData.group}`,
    recurrence: [repeatEventString],
  }

  if (groupData.googleCalendarEventId) {
    const res = await calendar.events.update({
      auth: authCretendials,
      // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently infoged in user, use the "primary" keyword.
      calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
      // Event identifier.
      sendUpdates: 'all',
      eventId: groupData.googleCalendarEventId,
      requestBody: resource
    });

    console.info('calendar patch: ', res);
    const resp = Utils.prepareResponse(res.body)
    return resp;
  } else {
    const resp = Utils.prepareResponse({ message: 'error' })
    return resp;
  }



}