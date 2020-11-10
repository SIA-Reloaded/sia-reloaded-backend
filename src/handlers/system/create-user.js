const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.TABLE;

const Utils = require('../../utils');

exports.createUser = async (event) => {
  console.info('received:', event);
  
  if (event.httpMethod !== 'POST') {
    throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
  } 
  const body = JSON.parse(event.body)
  console.info('table name:', tableName);
  
  const params = Utils.preparePutItemParams(tableName, body);
  console.info('params:', params);
  const result = await docClient.put(params).promise(tableName);

  const response = Utils.prepareResponse(result);
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
