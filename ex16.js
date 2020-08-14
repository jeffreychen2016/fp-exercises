//-----------------------
// correctly handle exception in composition
//-----------------------

const {
  Async,
  chain,
  tryCatch,
  resultToAsync,
  compose,
  map,
} = require("crocks");
const Result = require("crocks/Result");
const { Resolved, Rejected } = Async;

// case 1
const log = (label) => (message) => console.log(`${label}: ${message}`);

const getData = () => Resolved(null);

const parseData = (data) => data.person.name;

const wf = compose(chain(resultToAsync(tryCatch(parseData))), getData);

wf().fork(log("rej"), log("res"));

// case 2
const prepareInput = () => {
  throw new Error("boom!!!!");
};

const doSomethingWithInputAsync = (x) => Resolved(x);

const wf2 = compose(
  chain(doSomethingWithInputAsync),
  resultToAsync(tryCatch(prepareInput))
);

wf2().fork(log("rej"), log("res"));
