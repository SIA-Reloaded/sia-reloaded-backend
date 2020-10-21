
const tableName = process.env.TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getCourseHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const courseID = event.pathParameters.courseID;
    const queryParameters = event.queryStringParameters
    console.info(queryParameters, courseID)
    const params = {
        TableName: tableName,
        Key: {
            "teacherID": queryParameters.teacherID,
            "id": courseID
        }
    };
    console.info(params)
    const data = await docClient.get(params).promise();
    console.info(data)
    const item = data.Item;

    const response = {
        statusCode: 200,
        body: JSON.stringify(item)
    };

        console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}