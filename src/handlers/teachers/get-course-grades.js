const tableName = process.env.TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');


// Returns a list of curses for a given teacher, if a courseID is provided, returns that spectific course
exports.getCourseGradesHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getcourses only accept GET method, you tried: ${event.httpMethod}`);
  }

  const queryParameters = event.queryStringParameters;

  const body = [];

  const params = {
    TableName: tableName,
    FilterExpression: "#crs = :crsID",
    ExpressionAttributeNames: {
      "#crs": "course_id"
    },
    ExpressionAttributeValues: {
      ":crsID": queryParameters.courseID
    }
  };

  const data = await docClient.scan(params).promise();

  data.Items.forEach(function (item) {
    body.push(item);
  });

  const response = Utils.prepareResponse(body);

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}