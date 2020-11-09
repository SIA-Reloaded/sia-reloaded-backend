const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getRatesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }

    const queryParameters = event.queryStringParameters
    
    const params = {
        TableName: tableName,
        Key: {
            "teacherID": queryParameters.teacherID,
            "semester": queryParameters.semester
        }
    };

    const data = await docClient.get(params).promise();
    const item = data.Item;

    const response = Utils.prepareResponse(Item);

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}