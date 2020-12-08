
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getRequestHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
  }
  const queryParameters = event.queryStringParameters
  console.info("event: ", event)
  if (queryParameters.id) {
    const params = {
      TableName: tableName,
      Key: {
        "id": queryParameters.id
      }
    };

    //necesito id del curso, id del usuario y que state=sin_revisar


    const data = await docClient.get(params).promise();
    const item = data.Item;

    const response = Utils.prepareResponse(item);

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  } else if (queryParameters.requester_id && queryParameters.courseID) {

    const params = {
      TableName: tableName,
      FilterExpression: "requester_id = :requester_id and courseID =:courseID and #state = :state",
      ExpressionAttributeNames: {
        "#state": "state"
      },
      ExpressionAttributeValues: {
        ":requester_id": queryParameters.requester_id,
        ":courseID": queryParameters.courseID,
        ":state": "sin_revisar"
      }
    };

    const data = await docClient.scan(params).promise();
    
    const item = data.Items;
    const response = Utils.prepareResponse(item);
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;

  } else {
    const item = {}
    const response = Utils.prepareResponse(item);

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  }

}