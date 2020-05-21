// ---------------------------------------
// Monoid
// a Semigroup that has a special value - identity value
// stored on the types as a function call empty()
// (ps. it is VALUE that holds the function)
// (so, the function should NOT be in the prototype)
// laws:
// 1. Right identity
// MyType(x).concat(MyType.empty()) === MyType(x)
// 2. Left identity
// MyType.empty().concat(MyType(x)) === MyType(x)
// * Monoid is mainly used for reduce()
// ---------------------------------------

const { tagged } = require("daggy");

// create a Semigroup
const customNumber = tagged("customNumber", ["value"]);

// concat :: Semigroup a => a ~> a -> a
customNumber.prototype.concat = function (that) {
  return customNumber(this.value + that.value);
};

// add empty() method
// empty :: Monoid m => () -> m
customNumber.empty = function () {
  return customNumber(0);
};

console.log(customNumber(1).concat(customNumber.empty())); // return customNumber type with value of 1
console.log(customNumber.empty().concat(customNumber(1))); // return customNumber type with value of 1

// ---------------------------------------
// fold
// ---------------------------------------
// M is called 'type representation'
// ps. load a value into a Monoid type.
// const fold = (M) => (xs) => xs.reduce((acc, x) => acc.concat(M(x)), M.empty());
const sum = (M) => (xs) => xs.reduce((acc, x) => acc.concat(M(x)), M.empty());

const list = [1, 2, 3, 4, 5];
console.log(sum(customNumber)(list).value); // 15
