// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;
const coursesTableName = process.env.COURSE_TABLE;
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

  let params;
  params = {
    TableName: tableName,
    FilterExpression: 'code = :c',
    ExpressionAttributeValues: {
      ':c': code,
    }
  };
  console.info("serach group params:", params);

  const data = await docClient.scan(params).promise()
  const items = data.Items;
  const group = items.length;

  const calentarInsertResponse = await fetch('https://wb1jsep2hj.execute-api.us-east-1.amazonaws.com/Prod/system/createCalendarEvent');
  console.info('calendar event: ', calentarInsertResponse);

  const academicCalendar = academicCalendarItem.id;
  
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
    googleCalendarEvent: calentarInsertResponse,
  });
  console.info("create group params:", params);
  const result = await docClient.put(params).promise(tableName);



  const response = Utils.prepareResponse(result);
  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
