const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getRatesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }


    const { teacherID, academicCalendar } = event.queryStringParameters

    let params = {}
    const academicCalendarInit = "201501"
    const academicCalendarLast = "202002"


    if (academicCalendar) {
        params = {
            TableName: tableName,
            FilterExpression: 'teacherID = :tID and academicCalendar = :aCalendar',
            ExpressionAttributeValues: {
                ':tID': teacherID,
                ':aCalendar': academicCalendar
            }
        }
    } else {
        //KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
        params = {
            TableName: tableName,
            FilterExpression: 'teacherID = :tID and academicCalendar between :init and :last',
            ExpressionAttributeValues: {
                ':tID': teacherID,
                ':init': academicCalendarInit,
                ':last': academicCalendarLast,
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