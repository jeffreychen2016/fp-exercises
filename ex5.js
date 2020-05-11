// Given a list of digits, return the smallest number that could be formed from these digits, using the digits only once (ignore duplicates).
// minValue ({1, 3, 1})  ==> return (13)
// minValue({1, 9, 3, 1, 7, 4, 6, 6, 7}) return  ==> (134679)

const { sort, join } = require("ramda");
const { compose } = require("crocks");

const diff = (a, b) => a - b;

// sortList :: List -> List
const sortList = sort(diff);

// dedupe :: List -> Set
const dedupe = (list) => [...new Set(list)];

// concatNum: Set -> String
const concatNum = (list) => join("", list);

// compose functions
const workflow = compose(concatNum, dedupe, sortList);

// run
console.log(workflow([1, 9, 3, 1, 7, 4, 6, 6, 7]));
