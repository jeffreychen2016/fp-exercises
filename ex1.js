const R = require("ramda");
const C = require("crocks");
const axios = require("axios").default;
const fs = require("fs");

// log: String -> a -> a
const log = (label) => (x) => console.log(`${label}: ${x}`);

// httpGetEmployees :: (* -> Promise a e) -> (* -> Async e a)
const httpGetEmployees = C.Async.fromPromise(axios);

// isUndefined :: a -> bool
const isUndefined = (a) => a === undefined;

// getDataArray :: Object -> Just Foldable f | Nothing
const safeGetDataArray = C.compose(
  C.ifElse(isUndefined, C.Maybe.Nothing, C.Maybe.Just),
  R.path(["data", "data"])
);

// findEmployee :: Foldable f => f a -> Just object | Nothing
const safeFindEmployee = C.compose(
  C.ifElse(isUndefined, C.Maybe.Nothing, C.Maybe.Just),
  R.find(R.propEq("employee_name", "Tiger Nixon"))
);

// removeSalary :: Object -> Object
const removeSalary = R.dissocPath(["employee_salary"]);

// extractData :: Maybe a ~> (a -> Maybe b) -> Maybe b
// compose all pure computation seperate from the `workflow`
// so, i do not have to crazy stuff like map(map())
const extractData = C.compose(
  // return Async a
  C.maybeToAsync("No employee found..."),
  // return Just a
  C.map(removeSalary),
  // return Just a (flatten `Just Just a` to `Just a`)
  C.chain(safeFindEmployee),
  //   C.tap((x) => {
  //     console.log(x.inspect());
  //   }),
  // return Just a
  safeGetDataArray
);

// saveToFile :: ((*, NodeCallback) -> ()) -> (* -> Async e a)
const saveToFile = C.nAry(2, C.Async.fromNode(fs.writeFile));
const saveStringifiedResultToFile = C.compose(
  saveToFile("./test"),
  JSON.stringify
);

const workflow = C.compose(
  C.chain(saveStringifiedResultToFile),
  // return Async a (flatten Async Async a)
  // do not use map here. because the extract data returns Async
  // if use map, it will return Async Async a
  C.chain(extractData),
  // return Async a
  httpGetEmployees
);

workflow({
  method: "get",
  url: "http://dummy.restapiexample.com/api/v1/employees",
}).fork(R.identity, R.identity);

// data from the input call
// const responseShape = {
//   data: {
//     status: "success",
//     data: [
//       {
//         id: "1",
//         employee_name: "Tiger Nixon",
//         employee_salary: "320800",
//         employee_age: "61",
//         profile_image: "",
//       },
//     ],
//   },
//   status: 200,
//   statusText: "OK",
//   headers: {},
//   config: {},
//   request: {},
// };
