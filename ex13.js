// ---------------------------------------
// Functor
// any type that has map() method
// we put a value into a functor, we say we are LIFTING the value into functor
// x -> a : Represent a mapping to values.
// U(x).map(f) === U(f(x))
// map applies a function to the value(s) within a functor
// ---------------------------------------

const { tagged } = require("daggy");

const Functor = tagged("Functor", ["value"]);

// map :: Functor f => f a ~> (a -> b) -> f b
Functor.prototype.map = function (fn) {
  const result = [];
  for (let i = 0; i < this.value.length; i++) {
    result.push(fn(this.value[i]));
  }

  return Functor(result);
};

const array = Functor([1, 2, 3, 4]);

const add1 = (x) => x + 1;
const add2 = (x) => x + 2;

console.log(array.map(add1).value); // return Functor type with value [2,3,4,5]
console.log(array.map(add1).map(add2).value); // return Functor type with value [4,5,6,7]
