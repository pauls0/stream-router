// import awssdk from "aws-sdk";

exports.handler = async (event) => {
  const Payload = {
    perameters: JSON.stringify(event.queryStringParameters),
    host: "hello-world",
  };
  const response = {
    statusCode: 200,
    body: JSON.stringify(Payload),
  };
  return response;
};
