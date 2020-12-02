
const tableName = process.env.TABLE;
const tableNameUsers = process.env.USER_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils');


exports.updateRequestHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`getAllItems only accept POST method, you tried: ${event.httpMethod}`);
  }
  console.info("event: ", event)
  const body = JSON.parse(event.body)




  const date = new Date();
  const params = {
    TableName: tableName,
    Key: {
      "id": body.id
    },
    UpdateExpression: "set #state = :state, update_datetime = :update_datetime",
    ExpressionAttributeNames: {
      "#state": "state"
    },
    ExpressionAttributeValues: {
      ":state": body.state,
      ":update_datetime": date.toISOString(),
    }
  }

  console.info('params:', params);

  const result = await docClient.update(params).promise(tableName);


  if (body.state == "aprobado") {
    const paramsUser = {
      TableName: tableNameUsers,
      Key: {
        "id": body.requester_id
      }
    }

    let responseUser = await docClient.get(paramsUser).promise()
    console.log("respuesta de la tabla Users: ", responseUser)
    let coursesArray = []

    coursesArray = responseUser.Item.current_courses

    console.info("response: ", responseUser.Item.current_courses)

    coursesArray.push(body.courseID)
    console.info("courses array: ", coursesArray)
    let updateParamsUser = {
      TableName: tableNameUsers,
      Key: {
        "id": body.requester_id
      },
      UpdateExpression: "set current_courses = :current_courses, update_datetime = :update_datetime",
      ExpressionAttributeValues: {
        ":current_courses": coursesArray,
        ":update_datetime": date.toISOString(),
      }
    }

    const userUpdateResult = await docClient.update(updateParamsUser).promise(tableName);
    const userResponse = Utils.prepareResponse(userUpdateResult)
    console.info(`response from: ${event.path} statusCode: ${userResponse.statusCode} body: ${userResponse.body}`);
  }



  const response = Utils.prepareResponse(result);

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}