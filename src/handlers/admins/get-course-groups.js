const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getCourseGroups = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  const {courseCode, groupID} = event.queryStringParameters
  
  const params;
  if (groupID) {
    params = {
      TableName: tableName,
      KeyConditionExpression: 'code = :c and id = :i',
      ExpressionAttributeValues: {
        ':c': courseCode,
        ':i': groupID,
      }
    };
  } else {
    params = {
      TableName: tableName,
      KeyConditionExpression: 'code = :c',
      ExpressionAttributeValues: {
        ':c': courseCode,
      }
    };
  }
  
  const data = await docClient.Query(params).promise()
  const item = data.Item;

  console.info('data: ', data)
 
  const response = Utils.prepareResponse(item);

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
