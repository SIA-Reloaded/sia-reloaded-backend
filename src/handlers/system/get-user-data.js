const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getByUserDataHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  
  const username = event.pathParameters.username;
 

  var params = {
    TableName: tableName,
    Key: {
      "id": username
    },
  };
  console.log(params)

  const data = await docClient.get(params).promise();
  const item = data.Item;
 
  const response = Utils.prepareResponse(item);

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}