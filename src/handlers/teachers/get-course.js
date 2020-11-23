
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getCourseHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
  }

  const queryParameters = event.queryStringParameters

  const params = {
    TableName: tableName,
    Key: {
      "id": queryParameters.course_id
    }
  };

  const data = await docClient.get(params).promise();
  const item = data.Item;

  const response = Utils.prepareResponse(item);

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}