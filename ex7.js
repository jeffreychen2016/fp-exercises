// ---------------------------------------
// Create a Setoid
// ---------------------------------------
// that is, a type that has equals() method
// rules must obey:
// 1. a.equals(a) === true (reflexivity)
// 2. a.equals(b) === b.equals(a) (symmetry)
// 3. if a.equals(b) and b.equals(c) then a.equals(c) (transitivity)

const { tagged, taggedSum } = require("daggy");

// ---------------------------------------
// CustomNumber
// ---------------------------------------
console.log("CustomNumber:");
// create a custom type/container with named property 'value'
const CustomNumber = tagged("CustomNumber", ["value"]);

// equals :: CustomNumber ~> CustomNumber -> Bool
CustomNumber.prototype.equals = function (that) {
  return this.value === that.value;
};

const one = CustomNumber(1);
const anotherOne = CustomNumber(1);
const theOtherOne = CustomNumber(1);

// a.equals(a) === true;
console.log(one.equals(one));

// a.equals(b) === b.equals(a)
console.log(one.equals(anotherOne) && anotherOne.equals(one));

// a.equals(b) and b.equals(c) then a.equals(c)
console.log(
  one.equals(anotherOne) &&
    anotherOne.equals(theOtherOne) &&
    one.equals(theOtherOne)
);

// ---------------------------------------
// CustomString
// ---------------------------------------
console.log("CustomString:");
const CustomString = tagged("CustomString", ["value"]);

// equals :: CustomString ~> CustomString -> Bool
CustomString.prototype.equals = function (that) {
  return this.value === that.value;
};

const oneString = CustomString("1");
const anotherOneString = CustomString("1");
const theOtherOneString = CustomString("1");

// a.equals(a) === true;
console.log(oneString.equals(oneString));

// a.equals(b) === b.equals(a)
console.log(
  oneString.equals(anotherOneString) && anotherOneString.equals(oneString)
);

// a.equals(b) and b.equals(c) then a.equals(c)
console.log(
  oneString.equals(anotherOneString) &&
    anotherOneString.equals(theOtherOneString) &&
    oneString.equals(theOtherOneString)
);

// ---------------------------------------
// Shipment
// ---------------------------------------
console.log("Shipment:");
const Shipment = taggedSum("Shipment", {
  Declaration: ["fileNumber", "shipmentDate"],
  OneFile: ["fileNumber", "shipmentDate", "somethingElse"],
});

// for Type that have multiple constructors
// we will need to check for the equality of the
// 1. same constructors
// 2. the arguments that the constructors take in

// equals :: Setoid a => Shipment ~> Shipment -> Bool
Shipment.prototype.equals = function (that) {
  return this.cata({
    // evaluate each constructor with their arguments
    // this is why the TYPE CONSTRAINT (Setoid a) exists
    // because we need .equals() method from argument for comparision
    // a Setoid gurantees to have the method.
    Declaration: (fileNumber, shipmentDate) =>
      fileNumber.equals(that.fileNumber) &&
      shipmentDate.equals(that.shipmentDate),

    OneFile: (fileNumber, shipmentDate, somethingElse) =>
      fileNumber.equals(that.fileNumber) &&
      shipmentDate.equals(that.shipmentDate) &&
      somethingElse.equals(that.somethingElse),
  });
};

// CustomString is a Setoid
const decFn = CustomString("B123");
const decSd = CustomString("2010-01-01");
const oneFn = CustomString("I123");
const oneSd = CustomString("2020-01-01");
const se = CustomString("somethingElse");

const decA = Shipment.Declaration(decFn, decSd);
const decB = Shipment.Declaration(decFn, decSd);
const decC = Shipment.Declaration(decFn, decSd);

const oneA = Shipment.OneFile(oneFn, oneSd, se);
const oneB = Shipment.OneFile(oneFn, oneSd, se);
const oneC = Shipment.OneFile(oneFn, oneSd, se);

// a.equals(a) === true;
console.log(decA.equals(decA));
console.log(oneA.equals(oneA));

// a.equals(b) === b.equals(a)
console.log(decA.equals(decB) && decB.equals(decA));
console.log(oneA.equals(oneB) && oneB.equals(oneA));

// a.equals(b) and b.equals(c) then a.equals(c)
console.log(decA.equals(decB) && decB.equals(decC) && decA.equals(decC));
console.log(oneA.equals(oneB) && oneB.equals(oneC) && oneA.equals(oneC));
