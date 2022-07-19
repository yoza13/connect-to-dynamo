const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let message;
  switch (event.http_method) {
    case "GET":
      body = await dynamo.scan({ TableName: "todo-list" }).promise();
      break;
    case "DELETE":
      await dynamo
        .delete({
          TableName: "todo-list",
          Key: {
            id: event.taskToRemove,
          },
        })
        .promise();
      message = `Item with ID=${event.taskToRemove} deleted`;
      body = await dynamo.scan({ TableName: "todo-list" }).promise();
      break;
    case "PUT":
      const { body: requestBody } = event;
      await dynamo
        .put({
          TableName: "todo-list",
          Item: {
            id: String(Math.floor(100000 + Math.random() * 900000)),
            Task: requestBody.taskName,
            createdAt: new Date().getTime,
          },
        })
        .promise();
      message = `Item with taskName=${requestBody.taskName} added`;
      body = await dynamo.scan({ TableName: "todo-list" }).promise();
  }

  return {
    body,
    message,
  };
};
