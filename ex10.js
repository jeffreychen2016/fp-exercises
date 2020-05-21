// ---------------------------------------
// Semigroup
// a type that has concat().
// how the concat() works is upto you.
// for numbers, it can be `+`, '*' or others.
// for array, it can be `join` or whatever
// the key is that, the concat() method must return the same type
// laws:
// a.concat(b).concat(c) === a.concat(b.concat(c))
// ---------------------------------------

const { tagged } = require("daggy");

const CustomNumber = tagged("CustomNumber", ["value"]);

// concat :: CustomNumber a => a ~> a -> a
CustomNumber.prototype.concat = function (that) {
  return CustomNumber(this.value + that.value);
};

const one = CustomNumber(1);
const two = CustomNumber(2);

console.log(one.concat(two).concat(two)); // Semigroup a with value 5
console.log(one.concat(two.concat(two))); // Semigroup a with value 5

// -------------------------------------------
// create concat() method for CustomSet
// -------------------------------------------

const CustomSetA = tagged("CustomSet", ["value"]);

// concat :: [a] ~> [a] ->[a]
CustomSetA.prototype.concat = function (that) {
  const mergedSet = this.value.concat(that.value);
  return CustomSetA([...new Set(mergedSet)]);
};

console.log(
  CustomSetA([1, 2, 3])
    .concat(CustomSetA([4, 5, 6, 7, 8]))
    .concat(CustomSetA([7, 8, 9])).value
);

// => [1,2,3,4,5,6,7,8,9]

// -------------------------------------------
// merge customer records
// -------------------------------------------

// helpers
const Any = tagged("Any", ["value"]);
Any.prototype.concat = function (that) {
  return Any(this.value || that.value);
};

const All = tagged("All", ["value"]);
All.prototype.concat = function () {
  return All(this.value && that.value);
};

const First = tagged("First", ["value"]);
First.prototype.concat = function (that) {
  return this;
};

const Last = tagged("Last", ["value"]);
Last.prototype.concat = function (that) {
  return that;
};

// 1. create tuple (key/value pair)
// each inner value/property must be Semigroup as well
const Tuple = tagged("tuple", ["a", "b", "c", "d"]);

// 2. make the tuple a Semigroup type (create concat() method)
// concat :: (Semigroup a, Semigroup b, Semigroup c, Semigroup d) =>
//   Tuple a b c d~> Tuple a b c d -> Tuple a b c d
// concat :: customer -> customer
Tuple.prototype.concat = function (that) {
  return Tuple(
    this.a.concat(that.a),
    this.b.concat(that.b),
    this.c.concat(that.c),
    this.d.concat(that.d)
  );
};

// customer object shape
// each property in the customer must be Semigroup
const Customer = tagged("Customer", [
  "name", // String
  "favouriteThings", // String
  "registrationDate", // Int -- since epoch
  "hasMadePurchase", // Bool
]);

const customerA = Customer("Jeffery", "a", 200001001, false);
const customerB = Customer("Kevin", "b", 199000101, false);

// 4. create strategy which tranfer Customer into Tuple
const strategyA = {
  // convert customer into tuple
  to: (customer) =>
    // to :: Customer
    //    -> Tuple (First String)
    //             (First String)
    //             (Last Int)
    //             (Any Bool)
    Tuple(
      First(customer.name),
      First(customer.favouriteThings),
      Last(customer.registrationDate),
      Any(customer.hasMadePurchase)
    ),

  // convert tuple back to customer
  from: ({ a, b, c, d }) => Customer(a.value, b.value, c.value, d.value),
};

// 5. create funtion that takes in strategy and 2 customers
const merge = (strategy) => (x, y) =>
  strategy.from(strategy.to(x).concat(strategy.to(y)));

const result = merge(strategyA)(customerA, customerB);
console.log(result);
// Object.defineProperty.value {name: "Jeffery", favouriteThings: "a", registrationDate: 199000101, hasMadePurchase: false, @@values: Array(4)}
