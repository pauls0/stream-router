// import * as AWS from "aws-sdk"; // import entire SDK
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

function iptoint(ip: String): number {
  const octets = ip.split(".").map((octet) => parseInt(octet));
  const ip_int =
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3];
  return ip_int;
}
const ip: String = "104.28.18.197";
const ip_int: number = iptoint(ip);
console.log(ip_int);

function inRange(range: String, ip: String): Boolean {
  return false;
}

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const payload: any = {
    host: "hello-world",
    perameters: JSON.stringify(event.queryStringParameters),
  };
  if (
    event.queryStringParameters == null ||
    event.queryStringParameters == undefined
  ) {
    return {
      statusCode: 400,
      headers: {
        "content-type": "application/json",
      },
      isBase64Encoded: false,
      body: JSON.stringify({
        message: "Error: queryStringParameter 'ip' not found",
      }),
    };
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
    return response;
  }
};
