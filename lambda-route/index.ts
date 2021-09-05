// import * as AWS from "aws-sdk"; // import entire SDK
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { config, DynamoDB } from "aws-sdk";
import { Netmask } from "netmask";

config.update({
  region: "ap-southeast-2",
});

var docClient = new DynamoDB.DocumentClient();

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
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
  }

  const ip = event.queryStringParameters.ip!;
  const network = await getNetwork(iptoint(ip));
  const cdn = await getCDN(network);
  const host = await getHost(cdn, ip);

  const payload: any = {
    host: host,
  };
  const response = {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
  return response;
};

async function getNetwork(ip: number) {
  let network: number;
  await docClient
    .scan({
      TableName: "stream-router-table-cdir-network",
      FilterExpression: "#f <= :ip and #l >= :ip",
      ExpressionAttributeNames: {
        "#f": "first",
        "#l": "last",
      },
      ExpressionAttributeValues: {
        ":ip": ip,
      },
    })
    .promise()
    .then((data) => {
      if (data.Count == 0) {
        console.error("Error: No network found for ip: " + ip);
        network = 0;
      } else {
        network = data.Items![0].network;
      }
    })
    .catch((err) => {
      console.error("err", err);
    });

  return network!;
}

async function getCDN(network: number) {
  interface Mapping {
    network: number;
    cdn: string;
  }
  async function getMapping(networkKey: string): Promise<Mapping> {
    const params = {
      TableName: "stream-router-table-mappings",
      Key: {
        network: networkKey,
      },
    };
    let response = await docClient.get(params).promise();
    return response.Item! as Mapping;
  }
  const mapping = await getMapping("" + network);
  return mapping.cdn;
}

async function getDefaultHost(cdn: string) {
  let host: string;
  await docClient
    .get({
      TableName: "stream-router-table-cdn-host-defaults",
      Key: {
        cdn: cdn,
      },
    })
    .promise()
    .then((data) => {
      if (data.Item == undefined) {
        console.error("Error: No host found for cdn: " + cdn);
      } else {
        host = data.Item.host;
      }
    })
    .catch((err) => {
      console.error("err", err);
    });
  return host!;
}

async function getHost(cdn: string, ip: string) {
  type CDNHostRow = {
    cdn: string;
    cidr: string;
    base: number;
    first: number;
    last: number;
    host: string;
  };
  type CDNHostRowArray = CDNHostRow[];
  let mappings: CDNHostRowArray;
  let host = null;
  await docClient
    .query({
      TableName: "stream-router-table-cdn-host",
      KeyConditionExpression: "#cdn = :cdn",
      ExpressionAttributeNames: {
        "#cdn": "cdn",
      },
      ExpressionAttributeValues: {
        ":cdn": cdn,
      },
    })
    .promise()
    .then((data) => {
      if (data.Count == 0) {
        console.error("Error: No host found for cdn: " + cdn);
      } else {
        mappings = data.Items! as CDNHostRowArray;
      }
    })
    .catch((err) => {
      console.error("err", err);
    });
  mappings!.forEach(async (mapping) => {
    var cidr = new Netmask(mapping.cidr);
    if (cidr.contains(ip)) {
      host = mapping.host;
    }
  });
  if (host == null) {
    host = await getDefaultHost(cdn);
  }
  return host;
}

function iptoint(ip: string): number {
  const octets = ip.split(".").map((octet) => parseInt(octet));
  const ip_int =
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3];
  return ip_int;
}

function inttoip(int: number): string {
  var octet1 = (int >> 24) & 255;
  var octet2 = (int >> 16) & 255;
  var octet3 = (int >> 8) & 255;
  var octet4 = int & 255;
  return "" + octet1 + "." + octet2 + "." + octet3 + "." + octet4;
}

// async function run() {
//   var ip = 201326593;
//   var network = await getNetwork(ip);
//   var cdn = await getCDN(network);
//   var host = await getHost(cdn);
//   console.log("network", network);
//   console.log("cdn", cdn);
//   console.log("host", host);
// }
// run();
