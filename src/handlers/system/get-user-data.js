const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getByUserDataHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  
  const userIdentity = event.pathParameters.username;
 

  const params = {
    TableName: tableName,
    FilterExpression: 'username = :userIdentity or id = :userIdentity',
    ExpressionAttributeValues: {
      ":userIdentity": userIdentity,
    }
  };
  console.log(params)

  const data = await docClient.scan(params).promise();
  const item = data.Items;
 
  const response = Utils.prepareResponse(item);

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
