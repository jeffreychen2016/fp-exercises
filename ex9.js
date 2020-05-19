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
  return this.value === that.value;
};

// make the Setoid a Ord
// lte :: Ord a => a ~> a -> Bool
customNumber.prototype.lte = function (that) {
  return this.value <= that.value;
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

// ---------------------------------------
// Bubble Sort
// sometimes referred to as sinking sort,
// is a simple sorting algorithm that repeatedly steps through the list,
// compares adjacent elements and swaps them if they are in the wrong order
// ---------------------------------------

// bubbleSort :: Ord a => [a] ~> [a] -> [a]
const bubbleSort = (xs) => {
  let swap;
  let n = xs.length - 1;
  do {
    swap = false;
    for (let i = 0; i < n; i++) {
      if (!xs[i].lte(xs[i + 1])) {
        let temp = xs[i];
        xs[i] = xs[i + 1];
        xs[i + 1] = temp;
        swap = true;
      }
    }
    n--;
  } while (swap);
  return xs;
};

console.log(bubbleSort([three, two, one])); // [one, two, three]
console.log(bubbleSort([three, two, one, three])); // [one, two, three, three]

// infinite loop....
// const test = [1, 2, 3];
// for (var i = 0; i < test.length; i++) {
//   console.log(i);
//   const temp2 = test[i];
//   test[i] = test[i + 1];
//   test[i + i] = temp2;
// }

// console.log(test);
