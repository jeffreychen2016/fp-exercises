const {
  Async,
  compose,
  Either,
  eitherToAsync,
  chain,
  bichain,
} = require("crocks");
const { Left, Right } = Either;
const { find, propEq, ifElse, pathEq } = require("ramda");

const log = (label) => (x) =>
  console.log(`${label}: ${JSON.stringify(x, null, 2)}`);

const fakeGatewayList = [
  {
    GatewayId: "sgw-1234567A",
    GatewayARN:
      "arn:aws:storagegateway:us-east-1:12345678910:gateway/sgw-1234567A",
    GatewayType: "FILE_S3",
    GatewayOperationalState: "ACTIVE",
    GatewayName: "FileGateway",
  },
];

const fakeFileShareList = [
  {
    FileShareType: "NFS",
    FileShareARN: "arn:aws:storagegateway:us-east-1:12345678910:share/share-1A",
    FileShareId: "share-1A",
    FileShareStatus: "UNAVAILABLE",
    GatewayARN:
      "arn:aws:storagegateway:us-east-1:12345678910:gateway/sgw-1234567A",
  },
  {
    FileShareType: "NFS",
    FileShareARN: "arn:aws:storagegateway:us-east-1:12345678910:share/share-2B",
    FileShareId: "share-2B",
    FileShareStatus: "ACTIVE",
    GatewayARN:
      "arn:aws:storagegateway:us-east-1:12345678910:gateway/sgw-1234567A",
  },
];

// getGatewayList :: () -> Async
const getGatewayList = () => {
  return Async((rej, res) => {
    setTimeout(() => res(fakeGatewayList), 1000);
    // setTimeout(() => rej(fakeGatewayList), 1000);
  });
};

// getFileShareList :: () -> Async
const getFileShareList = () => {
  return Async((rej, res) => {
    setTimeout(() => res(fakeFileShareList), 1000);
    // setTimeout(() => rej(fakeGatewayList), 1000);
  });
};

// gatewayStatusPath :: Array -> Boolean
const gatewayStatusPath = pathEq([0, "GatewayOperationalState"], "ACTIVE");

// shareStatusPath :: Array -> Boolean
const shareStatusPath = compose(
  pathEq(["FileShareStatus"], "ACTIVE"),
  find(propEq("FileShareId", "share-2B"))
);

// checkStatus :: Boolean -> Right String | Left String
const checkStatus = (statusPath) =>
  ifElse(
    statusPath,
    (x) => Right(`${JSON.stringify(x, null, 2)}`),
    (x) =>
      Left(
        `File Gateway/Share is down. Here is the response: ${JSON.stringify(
          x,
          null,
          2
        )}`
      )
  );

// handleError :: String -> Async
const handleError = (message) => {
  return Async((rej, res) => {
    setTimeout(() => {
      res(`Wrote error message to log file: ${message}`);
    });
  });
};

// handleSuccess :: String -> Async
const handleSuccess = (message) => {
  return Async((rej, res) => {
    setTimeout(() => {
      res(`All done: ${message}`);
    });
  });
};

const workflow = compose(
  bichain(handleError, handleSuccess),
  // return Async
  chain(eitherToAsync(checkStatus(shareStatusPath))),
  // return Async
  chain(getFileShareList),
  // return Async (checkStatus returns Either, but I convert it to Async, that way i can chain the functions all the way through)
  chain(eitherToAsync(checkStatus(gatewayStatusPath))),
  // return Async
  getGatewayList
);

workflow().fork(log("rej"), log("res"));
