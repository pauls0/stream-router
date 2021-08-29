// import awssdk from "aws-sdk";

interface Mappings {
  network: number;
  cdn: string;
}
interface Payload {
  mappings: Mappings[];
}

const Payload: Payload = {
  mappings: [
    { network: 1, cdn: "" },
    { network: 2, cdn: "" },
    { network: 3, cdn: "" },
  ],
};

exports.handler = async () => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(Payload),
  };
  return response;
};
