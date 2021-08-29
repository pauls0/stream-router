// import * as AWS from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { config, DynamoDB } from "aws-sdk";

config.update({
  region: "ap-southeast-2",
});

var docClient = new DynamoDB.DocumentClient();

async function updateMapping(network: string, cdn: string): Promise<void> {
  await docClient
    .update({
      TableName: "stream-router-table-mappings",
      Key: {
        network: network,
      },
      UpdateExpression: "set cdn = :cdn",
      ExpressionAttributeValues: {
        ":cdn": cdn,
      },
    })
    .promise()
    .then((data) => {
      return new Promise((resolve) => {
        resolve(data);
      });
    })
    .catch((err) => {
      return new Promise((reject) => {
        reject(err);
      });
    });
}

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const network = event?.queryStringParameters?.network;
  const cdn = event?.queryStringParameters?.cdn;

  if (
    network == null ||
    network == undefined ||
    cdn == null ||
    cdn == undefined
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Please provide network and cdn",
      }),
    };
  }

  const response = await updateMapping(network, cdn)
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "success" }),
      };
    })
    .catch((err) => {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: JSON.stringify(err) }),
      };
    });

  return response;
};
// async function run() {
//   const response = await updateMapping("1", "F")
//     .then((data) => {
//       return {
//         statusCode: 200,
//         body: JSON.stringify({ message: "success" }),
//       };
//     })
//     .catch((err) => {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: JSON.stringify(err) }),
//       };
//     });

//   // return response;
//   console.log(response);
//   console.log("done");
// }
// run();
