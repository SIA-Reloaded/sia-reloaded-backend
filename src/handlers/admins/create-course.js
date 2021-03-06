// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE;

const Utils = require('../../utils');

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.courseGroups = async (event) => {
  console.info('received:', event);
  
  if (event.httpMethod !== 'POST') {
    throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
  }
  // All log statements are written to CloudWatch

  // Get id and name from the body of the request
  const body = JSON.parse(event.body)
  const { name, code } = body
  console.info('table name:', tableName);
  
  const params = Utils.preparePutItemParams(tableName, { name, code });
  console.info('params:', params);
  const result = await docClient.put(params).promise(tableName);

  const response = Utils.prepareResponse(result);
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
