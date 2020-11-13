const tableName = process.env.TABLE;

const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const Utils = require("../../utils");

exports.getCurrentAcademicCalendar = async (tableName) => {
  const params = {
    TableName: tableName,
    FilterExpression: "#current = :isCurrent",
    ExpressionAttributeValues: {
      ":isCurrent": true,
    },
    ExpressionAttributeNames: {
      "#current": "current",
    },
  };
  console.log(params);

  const data = await docClient.scan(params).promise();
  const item = data.Items[0];

  return item;
};

exports.getCurrentAcademicCalendarHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    );
  }

  const item = await this.getCurrentAcademicCalendar(tableName);
  const response = Utils.prepareResponse(item);

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
