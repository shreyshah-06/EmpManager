var AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: 'ap-south-1',
});

const dynmoDBTableName = process.env.DYNAMODB_TABLE_NAME;
console.log(dynmoDBTableName);
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let response ;
  console.log(event);
  switch (event.requestContext.http.method) {
    case 'POST':
      response = await saveUser(JSON.parse(event.body));
      break;
    case 'GET':
        response = await getUsers()
        break;
    case 'PUT':
        const requestBody = JSON.parse(event.body);
        response = await updateUser(requestBody.id,requestBody.updateKey,requestBody.updateValue);
        break;
    case 'DELETE':
        response = await deleteUser(JSON.parse(event.queryStringParameters.data).id)
        console.log(event)
        break;
    default:
       response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function saveUser(requestBody){
  console.log(requestBody);
      const params= {
          TableName: dynmoDBTableName,
          Item : requestBody 
      }
      return await dynamoDB.put(params).promise().then(() => {
          return buildResponse(200, 'User Saved Successfully');
      }, (error) => {
          console.log(error);
          return buildResponse(500, error);
      });
}

async function getUsers(){
    const params = {
        TableName: dynmoDBTableName
    }
    return await dynamoDB.scan(params).promise().then((response) => {
        return buildResponse(200, response);
    }, (error) => {
        console.log(error);
        return buildResponse(500, error);
    })
}


async function updateUser(id,updateKey,updateValue){
    const params = {
        TableName: dynmoDBTableName,
        Key: {
            "userId":id
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ":value": updateValue
        },
        returnValues: "UPDATED_NEW"
    }
    return await dynamoDB.update(params).promise().then((response) => {
        const body = {
            message: 'User Updated Successfully',
            data: response
        }
        return buildResponse(200, body);
    }, (error) => {
        console.log(error);
        return buildResponse(500, error);
    })
}

async function deleteUser(id){
    console.log(id)
    const params = {
        TableName: dynmoDBTableName,
        Key: {
            "userId":id
        },
        returnValues: "ALL_OLD"
    }
    return await dynamoDB.delete(params).promise().then((response) => {
        const body = {
            message: 'User Deleted Successfully',
            data: response
        }
        // getUsers();
        return buildResponse(200, body);
    },error => {
        console.log(error);
        return buildResponse(500, error);
    }
    )
}

function buildResponse(statusCode,body){
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}