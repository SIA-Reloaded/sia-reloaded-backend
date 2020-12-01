
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getAllRequestsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info(event)
    const params = {
        TableName: tableName
    }

    const data = await docClient.scan(params).promise()
    const response = Utils.prepareResponse(data)
    return response;
}