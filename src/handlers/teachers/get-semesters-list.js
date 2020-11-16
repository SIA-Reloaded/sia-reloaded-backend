const tableName = process.env.TABLE;

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const Utils = require("../../utils");

exports.getSemestersListHandler = async (event) => {
    if (event.httpMethod !== "GET") {
        throw new Error(
            `getAllItems only accept GET method, you tried: ${event.httpMethod}`
        );
    }
    const params = {
        TableName: tableName
    }

    const data = await docClient.scan(params).promise();
    const response = Utils.prepareResponse(data.Items);


    // All log statements are written to CloudWatch
    console.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );

    return response;
};
