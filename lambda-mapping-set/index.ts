// import awssdk from "aws-sdk";
// import { APIGatewayEvent, Context, Handler } from "aws-lambda";

exports.handler = async (event) => {
  const Payload = {
    perameters: JSON.stringify(event.queryStringParameters),
    status: "success",
  };
  const response = {
    statusCode: 200,
    body: JSON.stringify(Payload),
  };
  return response;
};
