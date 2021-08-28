// import awssdk from "aws-sdk";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda! mapping-set"),
  };
  return response;
};
