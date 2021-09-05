// import * as AWS from "aws-sdk"; // import entire SDK
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { config, DynamoDB, S3 } from "aws-sdk";
const ndjsonParser = require("ndjson-parse");
const Netmask = require("netmask").Netmask;

exports.handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  //
  await ImportCIDRNetwork();
  await ImportCDNHost();
  await ImportCDNHostDefaults();

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "complete" }),
  };
  return response;
};

config.update({
  region: "ap-southeast-2",
});
const s3 = new S3();
const docClient = new DynamoDB.DocumentClient();

function iptoint(ip: string): number {
  const octets = ip.split(".").map((octet) => parseInt(octet));
  const ip_int =
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3];
  return ip_int;
}

function intToip(int: number): string {
  var octet1 = (int >> 24) & 255;
  var octet2 = (int >> 16) & 255;
  var octet3 = (int >> 8) & 255;
  var octet4 = int & 255;
  return "" + octet1 + "." + octet2 + "." + octet3 + "." + octet4;
}

async function ImportCIDRNetwork() {
  type CIDRNetworkMapping = {
    network: number;
    cidr: string;
  };

  type CIDRNetworkMappings = CIDRNetworkMapping[];

  type CIDRNetworkRow = {
    host: number;
    first: number;
    last: number;
    network: number;
    cidr: string;
  };

  let mappings: CIDRNetworkMappings;

  async function get() {
    await s3
      .getObject({
        Bucket: "stream-router-dependancies",
        Key: "cdir-network.ndjson",
      })
      .promise()
      .then((data) => {
        if (data.Body) {
          mappings = ndjsonParser(data.Body.toString());
        }
      })
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  async function putMapping(item: CIDRNetworkMapping) {
    docClient
      .put({
        TableName: "stream-router-table-cdir-network",
        Item: item,
      })
      .promise()
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  function createMappingRow(mapping: CIDRNetworkMapping): CIDRNetworkRow {
    const cidr = new Netmask(mapping.cidr);
    return {
      host: iptoint(cidr.base),
      first: iptoint(cidr.first),
      last: iptoint(cidr.last),
      network: mapping.network,
      cidr: mapping.cidr,
    } as CIDRNetworkRow;
  }

  await get();
  mappings!.forEach((mapping) => {
    putMapping(createMappingRow(mapping));
  });
}

async function ImportCDNHost() {
  type CDNHostMapping = {
    CDN: string;
    cidr: string;
    host: string;
  };

  type CDNHostMappings = CDNHostMapping[];

  type CDNHostRow = {
    cdn: string;
    cidr: string;
    base: number;
    first: number;
    last: number;
    host: string;
  };

  let mappings: CDNHostMappings;

  async function get() {
    await s3
      .getObject({
        Bucket: "stream-router-dependancies",
        Key: "cdn-host.ndjson",
      })
      .promise()
      .then((data) => {
        if (data.Body) {
          mappings = ndjsonParser(data.Body.toString());
        }
      })
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  async function putMapping(item: CDNHostRow) {
    docClient
      .put({
        TableName: "stream-router-table-cdn-host",
        Item: item,
      })
      .promise()
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  function createMappingRow(mapping: CDNHostMapping): CDNHostRow {
    const cidr = new Netmask(mapping.cidr);
    return {
      cdn: mapping.CDN,
      cidr: mapping.cidr,
      base: iptoint(cidr.base),
      first: iptoint(cidr.first),
      last: iptoint(cidr.last),
      host: mapping.host,
    } as CDNHostRow;
  }

  await get();
  mappings!.forEach((mapping) => {
    putMapping(createMappingRow(mapping));
  });
}

async function ImportCDNHostDefaults() {
  type CDNHostDefaultMapping = {
    CDN: string;
    host: string;
  };

  type CDNHostDefaultMappings = CDNHostDefaultMapping[];

  type CDNHostDefaultRow = {
    cdn: string;
    host: string;
  };

  let mappings: CDNHostDefaultMappings;

  async function get() {
    await s3
      .getObject({
        Bucket: "stream-router-dependancies",
        Key: "cdn-host-defaults.ndjson",
      })
      .promise()
      .then((data) => {
        if (data.Body) {
          mappings = ndjsonParser(data.Body.toString());
        }
      })
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  async function putMapping(item: CDNHostDefaultRow) {
    docClient
      .put({
        TableName: "stream-router-table-cdn-host-defaults",
        Item: item,
      })
      .promise()
      .catch((err) => {
        console.error(err, err.stack);
      });
  }

  function createMappingRow(mapping: CDNHostDefaultMapping): CDNHostDefaultRow {
    return {
      cdn: mapping.CDN,
      host: mapping.host,
    } as CDNHostDefaultRow;
  }

  await get();
  mappings!.forEach((mapping) => {
    putMapping(createMappingRow(mapping));
  });
}
