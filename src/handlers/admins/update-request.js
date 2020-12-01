
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');


exports.updateRequestHandler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`getAllItems only accept PUT method, you tried: ${event.httpMethod}`);
    }
    const body = JSON.parse(event.body)

    const date = new Date();
    const params = {
        TableName: tableName,
        Key: {
            "id": body.id
        },
        UpdateExpression: "set #state = :state, update_datetime = :update_datetime",
        ExpressionAttributeNames: {
            "#state": "state"
        },
        ExpressionAttributeValues: {
            ":state": body.state,
            ":update_datetime": date.toISOString(),
        }
    }


    console.info('params:', params);

    const result = await docClient.update(params).promise(tableName);

    const response = Utils.prepareResponse(result);

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}