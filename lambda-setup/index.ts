// import * as AWS from "aws-sdk"; // import entire SDK
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
// import { config, DynamoDB } from "aws-sdk";

if (process.env.AWS_EXECUTION_ENV == undefined) {
  local_entrypoint();
} else {
  aws_entrypoint();
}

async function local_entrypoint() {}

function aws_entrypoint() {
  exports.handler = async (
    event: APIGatewayEvent
  ): Promise<APIGatewayProxyResult> => {
    const payload: any = {
      host: "hello-world",
    };
    const response = {
      statusCode: 200,
      body: JSON.stringify(payload),
    };
    return response;
  };
}
