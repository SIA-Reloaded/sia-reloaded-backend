const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.putStudentGradesHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`getMethod only accept POST method, you tried: ${event.httpMethod}`);
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
