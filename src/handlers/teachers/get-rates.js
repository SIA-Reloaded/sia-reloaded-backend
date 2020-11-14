const tableNameTeacher = process.env.TABLE_TEACHER;
const tableNameAcademicCalendar = process.env.TABLE_ACADEMIC_CALENDAR;

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const currentAcademicCalendar = require('./../system/get-current-academic-calendar')

const Utils = require("../../utils");

exports.getRatesHandler = async (event) => {
    if (event.httpMethod !== "GET") {
        throw new Error(
            `getAllItems only accept GET method, you tried: ${event.httpMethod}`
        );
    }

    const { teacherID, academicCalendar } = event.queryStringParameters;

    let params = {}
    let response = []

    if (academicCalendar) {
        arrAcademicCalendar = academicCalendar.split(",")
        for (i = 0; i < arrAcademicCalendar.length; i++) {

            params = {
                TableName: tableNameTeacher,
                FilterExpression: "teacherID = :tID and academicCalendar = :idAcademicCalendar",
                ExpressionAttributeValues: {
                    ":tID": teacherID,
                    ":idAcademicCalendar": arrAcademicCalendar[i],
                }
            }
            const data = await docClient.scan(params).promise();
            response.push(data.Items)

        }

    } else {

        //KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
        const academicCalendar = await currentAcademicCalendar.getCurrentAcademicCalendar(tableNameAcademicCalendar);
        const idAcademicCalendar = academicCalendar.id;

        params = {
            TableName: tableNameTeacher,
            FilterExpression:
                "teacherID = :teacherID and academicCalendar  = :idAcademicCalendar",
            ExpressionAttributeValues: {
                ":teacherID": teacherID,
                ":idAcademicCalendar": idAcademicCalendar
            },
        };

        const data = await docClient.scan(params).promise();
        response = data.Items
    }

    response = Utils.prepareResponse(response);

    // All log statements are written to CloudWatch
    console.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
};
