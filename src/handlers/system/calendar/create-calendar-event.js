const { addMinutes } = require('date-fns')
const { google } = require('googleapis')
const credentials = require('./suia-calendar-key.json');
const Utils = require('../../../utils');

const DayToNumber = {
  MO: 14,
  TU: 15,
  WE: 16,
  TH: 17,
  FR: 18,
  SA: 19,
  SU: 20,
}

exports.createCalendarEventHandler = async (event) => {
  console.info('event: ', event)

  const body = JSON.parse(event.body);
  const { name, code, group, schedule, studentsUserNames, teachersUsernames } = { ...body }

  console.info("schedule: ", schedule)

  let days = '';

  schedule.forEach(session => {
    days += `${session.day},`
  });

  console.info('days: ', days)

  const repeatEventString = `RRULE:FREQ=WEEKLY;COUNT=16;BYDAY=${days}`

  console.info('repeatEventString: ', repeatEventString)

  const startHours = parseInt(schedule[0].startHours.split(':')[0])
  const endHours = parseInt(schedule[0].endHours.split(':')[0])

  const startDate = new Date(2020, 11, DayToNumber[schedule[0].day], startHours, 0, 0)
  const endDate = new Date(2020, 11, DayToNumber[schedule[0].day], endHours, 0, 0)

  console.info('startDate: ', startDate)
  console.info('endDate: ', endDate)

  const studentsEmails = []
  const teachersEmails = []

  if (studentsUserNames) studentsUserNames.forEach(student => {
    studentsEmails.push(`${student}@unal.edu.co`)
  });

  if (teachersUsernames) teachersUsernames.forEach(teacher => {
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


  //const groupData = JSON.stringify(event.Records[0].dynamodb.NewImage.name)

  console.info('group data: ', [name, code, group, schedule])

  await authCretendials.authorize();

  const calendar = google.calendar('v3')

  const response = await calendar.events.insert({
    auth: authCretendials,
    calendarId: 'c_b8roiuktmnlhc30aaqll756h1s@group.calendar.google.com',
    resource: {
      start: {
        dateTime: startDate.toISOString().slice(0, -1),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDate.toISOString().slice(0, -1),
        timeZone: 'America/Bogota',
      },
      summary: `Clase de ${name}`,
      status: 'confirmed',
      description: `Clase de ${name} - ${code} grupo ${group}`,
      recurrence: [repeatEventString],
    },
  })

  console.info('insert result: ', response)

  const eventData = await JSON.parse(response.config.body)

  let calendarEventData = { ...eventData, id: response.data.id };

  console.info('insert calendarEventData: ', calendarEventData)
  console.info('insert response.data.id: ', response.data.id)

  const resp = Utils.prepareResponse(calendarEventData)

  return resp;
}