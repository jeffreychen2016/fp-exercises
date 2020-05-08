const R = require("ramda");
const C = require("crocks");
const T = require("true-myth");

// log :: String -> a -> String
const log = (label) => (x) => console.log(`${label}: ${x}`);

// uploadData :: Object -> Async
const uploadData = () => {
  return C.Async((rej, res) => {
    setTimeout(() => {
      console.log("upload failed");
      rej("update data failed");
    }, 2000);
  });
};

const sendEmail = (x) => {
  return C.Async((rej, res) => {
    setTimeout(() => {
      console.log("sendEmail: " + x);
      res("email sent");
    }, 1000);
  });
};

const sendSlack = (x) => {
  return C.Async((rej, res) => {
    setTimeout(() => {
      console.log("sendSlack: " + x);
      res("slack sent");
    }, 1000);
  });
};

const logToFile = (x) => {
  return C.Async((rej, res) => {
    setTimeout(() => {
      console.log("logToFile: " + x);
      res("logged");
    }, 1000);
  });
};

const handleError = C.compose((x) =>
  C.Async.all([sendSlack(x), sendEmail(x), logToFile(x)])
);

const workflow = C.compose(
  C.bichain(handleError, C.Async.Resolved),

  // return Async
  uploadData
);

workflow().fork(log("rej"), log("res"));

// const { Async } = require("crocks");
// const { Resolved, Rejected, all } = Async;
// all([Resolved(1), Resolved(2), Resolved(3)]).fork(log("rej"), log("res"));
//=> res: [ 1, 2, 3 ]

// join :: a -> b -> String
// const join = (a) => (b) => `${a} ${b}`;

// const workflow = C.Async.Rejected(join)
//   .ap(C.Async.Resolved("a"))
//   .ap(C.Async.Resolved("b"));
// workflow.fork(log("rej"), log("res"));
