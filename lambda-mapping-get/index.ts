// import * as AWS from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { config, DynamoDB } from "aws-sdk";

config.update({
  region: "ap-southeast-2",
});

var docClient = new DynamoDB.DocumentClient();

interface Mapping {
  network: number;
  cdn: string;
}
interface Payload {
  mappings: Mapping[];
}

async function getMapping(networkKey: string): Promise<Mapping> {
  let mapping: Mapping;

  const params = {
    TableName: "stream-router-table-mappings",
    ExpressionAttributeValues: {
      ":network": networkKey,
    },
    KeyConditionExpression: "network = :network",
  };

  await docClient
    .query(params)
    .promise()
    .then((data) => {
      if (data.Items) {
        mapping = {
          network: data.Items[0].network,
          cdn: data.Items[0].cdn,
        };
      }
    })
    .catch((err) => {
      console.error("ERROR:", JSON.stringify(err, null, 2));
    });

  return new Promise((resolve) => {
    resolve(mapping);
  });
}

async function getPayload(): Promise<Payload> {
  const mapping1 = await getMapping("1");
  const mapping2 = await getMapping("2");
  const mapping3 = await getMapping("3");

  const payload = {
    mappings: [mapping1, mapping2, mapping3],
  };

  return new Promise((resolve) => {
    resolve(payload);
  });
}

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const payload: Payload = await getPayload();

  const response = {
    statusCode: 200,
    body: JSON.stringify(payload),
  };

  return response;
};
