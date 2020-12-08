const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getCourseGroups = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  console.info(event)
  
  const query = event.queryStringParameters || {};
  const {courseCode = undefined, courseName = undefined } = query
  
  let params;
  if (!courseName && !courseCode) {
    params = {
      TableName: tableName,
    };
  } else if (courseName) {
    params = {
      TableName: tableName,
      FilterExpression: 'code = :c and name = :n',
      ExpressionAttributeValues: {
        ':c': courseCode,
        ':n': courseName,
      }
    };
  } else {
    params = {
      TableName: tableName,
      FilterExpression: 'code = :c',
      ExpressionAttributeValues: {
        ':c': courseCode,
      }
    };
  }
  
  const data = await docClient.scan(params).promise()
  const item = data.Items;

  console.info('data: ', data)
 
  const response = Utils.prepareResponse(item);

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
