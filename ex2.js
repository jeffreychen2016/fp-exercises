const R = require("ramda");
const C = require("crocks");

// add :: (Number, Number) -> Number
const add = (acc, elem) => R.add(acc, elem.price);

// total :: Folderable f => f Number -> Number
// const total = R.reduce((acc, elem) => R.add(acc, elem.price), 0);
const total = R.reduce(add, 0);

// discount :: Number -> Number -> Number
const afterDiscount = (rate) => (x) => x * (1 - rate);

// afterTax :: Number -> Number -> Number
const afterTax = (rate) => (x) => x - x * rate;

// composition
const orderTotal = C.compose(afterTax(0.0975), afterDiscount(0.2), total);

// input
const shoppingCart = [
  { id: 1, item: "ice cream", price: 1 },
  { id: 2, item: "apple", price: 2 },
  { id: 3, item: "banana", price: 3 },
  { id: 4, item: "orange", price: 4 },
];

const result = orderTotal(shoppingCart);

console.log(result);
