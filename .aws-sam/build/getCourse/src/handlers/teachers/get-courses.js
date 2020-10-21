const tableName = process.env.TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getCoursesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getcourses only accept GET method, you tried: ${event.httpMethod}`);
    }

    let response = {
        statusCode: 200,
    };

    const body = [];

    const queryParameters = event.queryStringParameters    
    console.log(queryParameters);
    const params = {
        TableName: tableName,
        FilterExpression: "#tchr = :tchrID",
        ExpressionAttributeNames:{
            "#tchr": "teacherID"
        },
        ExpressionAttributeValues: {
            ":tchrID": queryParameters.teacherID
        }
    };
    const data = await docClient.scan(params).promise();
    
    console.log("Query succeeded.");
    data.Items.forEach(function(item) {
        body.push(item);
    });

    response.body = JSON.stringify(body);

    
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}