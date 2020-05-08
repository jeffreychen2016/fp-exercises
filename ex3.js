const R = require("ramda");
const C = require("crocks");
const T = require("true-myth");

console.log(C.Maybe.of(undefined).inspect());
console.log(T.Maybe.of(null));
