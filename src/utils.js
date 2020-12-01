const { v1: uuidv1 } = require('uuid');

const prepareResponse = (body, statusCode = 200, additionalHeaders = {}) => {
  return {
    'statusCode': statusCode,
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      ...additionalHeaders
    },
    'body': JSON.stringify(body),
    "isBase64Encoded": false
  }
}

const preparePutItemParams = (table, item, itemIdProperty = 'id') => {
  const date = new Date();
  const preparedItem = {
    [itemIdProperty]: uuidv1(),
    ...item,
    create_datetime: date.toISOString(),
    update_datetime: date.toISOString()
  }

  const params = {
    TableName: table,
    Item: preparedItem
  }

  return params;
}

exports.prepareResponse = prepareResponse;
exports.preparePutItemParams = preparePutItemParams;