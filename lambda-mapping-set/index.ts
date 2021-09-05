// import * as AWS from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { config, DynamoDB } from "aws-sdk";

if (process.env.AWS_EXECUTION_ENV == undefined) {
  local_entrypoint();
} else {
  aws_entrypoint();
}

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

async function response(network: string, cdn: string) {
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
}

function local_entrypoint() {
  const network = "";
  const cdn = "";
  console.log(response(network, cdn));
}

function aws_entrypoint() {
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

    return response(network, cdn);
  };
}
