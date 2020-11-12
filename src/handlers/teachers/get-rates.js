const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.getRatesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }


    const queryParameters = event.queryStringParameters
    console.log(queryParameters)

    const params = {
        TableName: tableName,
        KeyConditionExpression: 'teacherID = :tID and academicCalendar = :aCalendar',
        ExpressionAttributeValues: {
            ':tID': queryParameters.teacherID,
            ':aCalendar': queryParameters.academicCalendar
        }
    };

    let response = 0

    docClient.query(params, function (err, data) {
        if (err) {
            console.log("da error ",err)
            response = Utils.prepareResponse(err);
        } else {
            console.log(data)
            response = Utils.prepareResponse(data);
        }
    })


    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}