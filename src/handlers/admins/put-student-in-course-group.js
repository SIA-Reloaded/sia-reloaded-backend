
const courseGroupTableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

// const bodyPutStudentInCourseGroup = {
//     username: username
//     requester_id: requester_id,
//     courseID: courseID
// }

exports.putStudentInCourseGroupHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`getAllItems only accept POST method, you tried: ${event.httpMethod}`);
    }
    const body = JSON.parse(event.body)

    const getCourseParams = {
        TableName: courseGroupTableName,
        Key: {
            "id": body.courseID
        }
    };

    const data = await docClient.get(getCourseParams).promise();
    const course = data.Item;

    console.info("return from getCourse: ", course)

    course.studentsUserNames.push(body.username)

    console.info("after adding the student: ", course)


    const date = new Date();
    const updateCourseParams = {
        TableName: courseGroupTableName,
        Key: {
            "id": body.courseID
        },
        UpdateExpression: "set studentsUserNames = :studentsUserNames, update_datetime = :update_datetime",
        ExpressionAttributeValues: {
            ":studentsUserNames": course.studentsUserNames,
            ":update_datetime": date.toISOString(),
        }
    }


    const result = await docClient.update(updateCourseParams).promise(courseGroupTableName);

    const response = Utils.prepareResponse(result);

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}