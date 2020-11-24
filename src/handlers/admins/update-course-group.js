
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.updateCourseGroupHandler = async (event) => {
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
        UpdateExpression: "set capacityDistribution = :capacityDistribution, classroom = :classroom, code = :code, #name = :name, schedule = :schedule, students = :students, teacherID = :teacherID, update_datetime = :update_datetime",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":capacityDistribution": body.capacityDistribution,
            ":classroom": body.classroom,
            ":code": body.code,
            ":name": body.name,
            ":schedule": body.schedule,
            ":students": body.students,
            ":teacherID": body.teacherID,
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