const prepareResponse = (body, statusCode = 200, additionalHeaders = {}) => {
  return {
    'statusCode': statusCode,
    'headers': {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...additionalHeaders
    },
    'body': JSON.stringify(body),
    "isBase64Encoded": false
  }
}

exports.prepareResponse = prepareResponse;