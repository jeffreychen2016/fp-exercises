const { tagged, taggedSum } = require("daggy");

// // creating constructor (Coord) with named properties (x and y).
// const Coord = tagged("Coord", ["x", "y", "z"]);

// Coord.prototype.move = function (x, y, z) {
//   return Coord(this.x + x, this.y + y, this.z + z);
// };

// console.log(Coord(1, 2, 3));
// console.log(Coord(1, 2, 3).move(1, 1, 1));

// // -------------------------------------------
const Bool = taggedSum("Bool", {
  True: [],
  False: [],
});

console.log(Bool.True.is(Bool.True));

// // creating mutilple constructors (Square and Circle) for Shape type
// const Shape = taggedSum("Shape", {
//   // Square :: (Coord, Coord) -> Shape
//   // elements in the array are arguments for the constructor
//   Square: ["topleft", "bottomright"],

//   // Circle :: (Coord, Number) -> Shape
//   // elements in the array are arguments for the constructor
//   Circle: ["centre", "radius"],
// });

// // attaching translate method to Shape prototype
// Shape.prototype.translate = function (x, y, z) {
//   // pass { constructor: handler } to cata() function
//   // the appropriate handle will be called when translate() method is being called

//   // must include both Square and Circle constructors for Cata(),
//   // otherwise will get error
//   return this.cata({
//     // the arguments in the () should match with the arguments specificied for the constructor
//     Square: (topleft, bottomright) =>
//       Shape.Square(topleft.move(x, y, z), bottomright.move(x, y, z)),

//     Circle: (centre, radius) => Shape.Circle(centre.move(x, y, z), radius),
//   });
// };

// const square = Shape.Square(Coord(2, 2, 0), Coord(3, 3, 0)).translate(3, 3, 3);
// const circle = Shape.Circle(Coord(2, 2, 0), 2).translate(3, 3, 3);

// console.log(square);
// console.log(circle);

// ------------------------------------
const Character = taggedSum("Character", {
  // Human :: (Number, Number) -> Character
  Human: ["hp", "level"],

  // Demon :: (Number, Number. Number) -> Character
  Demon: ["hp", "level", "mp"],
});

Character.prototype.showStat = function () {
  return this.cata({
    Human: (hp, level) => Character.Human(hp, level),
    Demon: (hp, level, mp) => Character.Demon(hp, level, mp),
  });
};

Character.prototype.powerUp = function () {
  return this.cata({
    Human: (hp, level) => Character.Human(hp * hp, level * level),
    Demon: (hp, level, mp) => Character.Demon(hp * hp, level * level, mp * mp),
  });
};

const human1Stat = Character.Human(2, 3).showStat().powerUp().powerUp();
const human2Stat = Character.Human(40, 4).showStat().powerUp();
const demonStat = Character.Demon(1000, 100, 1000).showStat().powerUp();

console.log(human1Stat);
console.log(human2Stat);
console.log(demonStat);
