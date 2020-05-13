// ---------------------------------------
// Create functions that work with Setoid
// ---------------------------------------
const { tagged, taggedSum } = require("daggy");

// ---------------------------------------
// Create notEquals function
// ---------------------------------------
// create a Setoid
const CustomNumber = tagged("CustomNumber", ["value"]);
const one = CustomNumber(1);
const two = CustomNumber(2);

// equals :: CustomNumber ~> CustomNumber -> Bool
CustomNumber.prototype.equals = function (that) {
  return this.value === that.value;
};

// notEquals :: Setoid a => a -> a -> Bool
const notEqualsA = (x) => (y) => !x.equals(y);
const notEqualsB = (x) => (y) => x !== y;

console.log(notEqualsA(one)(two));
console.log(notEqualsB(1)(2));

// ---------------------------------------
// Create Write a function to determine whether a given list’s values form a palindrome
// ---------------------------------------

// isPalindrome :: Setoid a => [a] -> Bool
const isPalindrome = (xs) => {
  const reversedXs = [...xs].reverse();
  for (var i = 0; i < xs.length; i++) {
    if (!xs[i].equals(reversedXs[i])) return false;
  }

  return true;
};

const three = CustomNumber(3);
const four = CustomNumber(4);
const five = CustomNumber(5);
const six = CustomNumber(6);
const seven = CustomNumber(7);

console.log(isPalindrome([three, four, five, four, three]) === true);
console.log(isPalindrome([three, four, five, six, seven]) === false);

// ---------------------------------------
// Create a Set type that stores a unique set of values
// You’ll need methods for adding and removing elements,
// and the former will need a check to see whether the element already exists in the internal store
// ---------------------------------------

const CustomSet = tagged("CustomSet", ["values"]);

// add :: Setoid a => a -> [a]
CustomSet.prototype.add = function (x) {
  if (this.values.indexOf(x) === -1) {
    return [...this.values, x];
  } else {
    return [...this.values];
  }
};

const setA = CustomSet([1, 2, 3]);
console.log(setA.add(2)); // [1, 2, 3]
console.log(setA.add(4)); // [1, 2, 3, 4]

const setB = CustomSet(["a", "b", "c"]);
console.log(setB.add("a")); // ["a", "b", "c"]
console.log(setB.add("d")); // ["a", "b", "c", "d"]

const setC = CustomSet([]);
console.log(setC.add("a")); // ["a"]
console.log(setC.add("d")); // ["d"]
console.log(setC.add(null)); // [null]
