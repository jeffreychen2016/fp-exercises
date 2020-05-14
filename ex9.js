// ---------------------------------------
// Ord
// a Setoid type that has addtional .lte() (less-than-or-equal)
// laws:
// 1. a.lte(b) || b.lte(a) === true
// 2. a.lte(b) && b.lte(a) === a.equals(b)
// 3. a.lte(b) && b.lte(c) === a.lte(c)
// ---------------------------------------

const { tagged } = require("daggy");

const customNumber = tagged("CustomNumber", ["value"]);

// make the customNumber a Setoid
customNumber.prototype.equals = function (that) {
  return this === that;
};

// make the Setoid a Ord
// lte :: Ord a => a ~> a -> Bool
customNumber.prototype.lte = function (that) {
  return this <= that;
};

const one = customNumber(1);
const two = customNumber(2);
const three = customNumber(3);

// 1. a.lte(b) || b.lte(a) === true
console.log(one.lte(two) || two.lte(one));

// 2. a.lte(b) && b.lte(a) === a.equals(b) ???? WTH.... ???
console.log(one.lte(one));

// 3. a.lte(b) && b.lte(c) === a.lte(c)
console.log(one.lte(two) && two.lte(three) && one.lte(three));
