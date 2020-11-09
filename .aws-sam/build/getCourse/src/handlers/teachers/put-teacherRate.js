
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');

exports.putTeacherRateHandler = async (event) => {

    if (event.httpMethod !== 'POST') {
        throw new Error(`putTeacherRate only accept POST method, you tried: ${event.httpMethod}`);
    }


    const body = JSON.parse(event.body)
    const id = "".concat(body.academicCalendar, body.teacherID, body.courseID)
    const teacherRate = {
        id: id,
        teacherID: body.teacherID,
        courseID: body.courseID,
        academicCalendar: body.academicCalendar,
        questions: [],
        answers: []
    }


    // questionID	string
    // body	string
    // score	number
    // value	number
    // selectedOptions	[...]

    Object.keys(body).forEach(code => {

        if (code == "options") {
            Object.keys(body[code]).forEach(auxCode => {
                if (!isNaN(parseInt(auxCode))) {
                    teacherRate.questions.push(auxCode)
                    if (typeof body[code][auxCode] == "object") {
                        let auxArr = [...body[code][auxCode]]
                        teacherRate.answers.push({
                            questionID: auxCode,
                            selectedOptions: auxArr
                        })
                    } else if (typeof body[code][auxCode] == "string") {
                        teacherRate.answers.push({
                            questionID: auxCode,
                            body: body[code][auxCode]
                        })
                    } else {
                        teacherRate.answers.push({
                            questionID: auxCode,
                            score: body[code][auxCode]
                        })
                    }
                }
            })
        }

        if (!isNaN(parseInt(code))) {
            teacherRate.questions.push(code)
            if (typeof body[code] == "object") {
                let auxArr = [...body[code]]
                teacherRate.answers.push({
                    questionID: code,
                    selectedOptions: auxArr
                })
            } else if (typeof body[code] == "string") {
                teacherRate.answers.push({
                    questionID: code,
                    body: body[code]
                })
            } else {
                teacherRate.answers.push({
                    questionID: code,
                    score: body[code]
                })
            }

        }
    })



    const params = {
        TableName: tableName,
        Item: teacherRate
    };

    const data = await docClient.put(params).promise();

    const response = Utils.prepareResponse(data);

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}