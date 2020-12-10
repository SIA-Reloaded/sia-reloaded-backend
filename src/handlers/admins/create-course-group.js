// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const userTableName = process.env.USER_TABLE;
const fetch = require('node-fetch').default;
const academicCalendarTableName = process.env.ACADEMIC_CALENDAR;

const Utils = require("../../utils");
const AcademicCalendar = require("../system/get-current-academic-calendar");

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.createCourseGroup = async (event) => {
  // if (event.httpMethod !== 'POST') {
  //   throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
  // }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  // Get id and name from the body of the request
  const body = JSON.parse(event.body);
  const {
    name,
    code,
    capacityDistribution,
    schedule,
    classroom,
    studentsUserNames,
    teachersUsernames,
  } = body;

  const academicCalendarItem = await AcademicCalendar.getCurrentAcademicCalendar(
    academicCalendarTableName
  );

  const academicCalendar = academicCalendarItem.id;

  let params;
  params = {
    TableName: tableName,
    FilterExpression: 'code = :c',
    ExpressionAttributeValues: {
      ':c': code,
    }
  };
  console.info("search group params:", params);

  const data = await docClient.scan(params).promise()
  const items = data.Items;
  const group = items.length;

  const courseGroupData = {
    name,
    code,
    group,
    capacityDistribution,
    schedule,
    classroom,
    studentsUserNames,
    teachersUsernames,
    academicCalendar,
  }

  const calentarInsertResponse = await fetch('https://wb1jsep2hj.execute-api.us-east-1.amazonaws.com/Prod/system/createCalendarEvent', {
    method: 'POST',
    body: JSON.stringify(courseGroupData),
    headers: { 'Content-Type': 'application/json' }
  },
  )

  const googleCalendarEvent = await calentarInsertResponse.json();
  console.info('calendar event: ', googleCalendarEvent);

  const googleCalendarEventId = googleCalendarEvent.id;

  // Creates a new item, or replaces an old item with a new item
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  params = Utils.preparePutItemParams(tableName, {
    name,
    code,
    group,
    capacityDistribution,
    schedule,
    classroom,
    studentsUserNames,
    teachersUsernames,
    academicCalendar,
    googleCalendarEventId,
  });

  await docClient.put(params).promise().then();

  // const updateUserData = async (participant) => {
  //   const participantResponse = await fetch(`https://wb1jsep2hj.execute-api.us-east-1.amazonaws.com/Prod/system/getUserData/${participant}`)
  //   const participantAux = await participantResponse.json();
  //   const participantData = participantAux[0]
  //   console.log('participantData', participantData)
  //   const courses = participantData.current_courses
  //   console.log('courses', courses)
  //   const date = new Date();
  //   const participanParams = {
  //     TableName: userTableName,
  //     Key: {
  //       "id": participantData.id
  //     },
  //     UpdateExpression: "set current_courses = :current_courses, update_datetime = :update_datetime",
  //     ExpressionAttributeValues: {
  //       ":current_courses": [...courses, params.id],
  //       ":update_datetime": date.toISOString(),
  //     }
  //   }

  //   console.info('params:', participanParams);

  //   await docClient.update(participanParams).promise();
  // }

  // const participants = [...studentsUserNames, ...teachersUsernames]

  // console.log('participants: ', participants)

  // for (let i = 0; i < participants.length; i++) {
  //   await updateUserData(participants[i]);
  // }

  const response = Utils.prepareResponse('');
  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
