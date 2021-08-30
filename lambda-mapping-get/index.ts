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
  // let mapping: Mapping;

  const params = {
    TableName: "stream-router-table-mappings",
    Key: {
      network: networkKey,
    },
    // ExpressionAttributeValues: {
    //   ":network": networkKey,
    // },
    // KeyConditionExpression: "network = :network",
  };

  let response = await docClient.get(params).promise();
  return response.Item! as Mapping;
}

async function getPayload(): Promise<Payload> {
  const mapping1 = getMapping("1");
  const mapping2 = getMapping("2");
  const mapping3 = getMapping("3");

  const payload = {
    mappings: await Promise.all([mapping1, mapping2, mapping3]),
  };

  return payload;
}

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // await getMapping("1");
  const payload: Payload = await getPayload();

  const response = {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
  return response;
};

// async function run() {
//   // const payload: Payload = await getPayload();
//   // const response = {
//   //   statusCode: 200,
//   //   body: JSON.stringify(payload),
//   // };
//   // console.log(response);

//   let response = await getMapping("1");
//   console.log(response);
// }
// run();
