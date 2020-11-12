const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getRatesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }


    const queryParameters = event.queryStringParameters

    let params = {}

    if (queryParameters.academicCalendar) {
        params = {
            TableName: tableName,
            FilterExpression: 'teacherID = :tID and academicCalendar = :aCalendar',
            ExpressionAttributeValues: {
                ':tID': queryParameters.teacherID,
                ':aCalendar': queryParameters.academicCalendar
            }
        }
    } else {
        //KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
        params = {
            TableName: tableName,
            FilterExpression: 'teacherID = :tID and academicCalendar between 201501 and 202001',
            ExpressionAttributeValues: {
                ':tID': queryParameters.teacherID
            }
        }
    }


    const data = await docClient.scan(params).promise()
    const item = data.Items;

    console.info('data: ', data)

    const response = Utils.prepareResponse(item);

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}