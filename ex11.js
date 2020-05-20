// ---------------------------------------
// Node Event
// not FP stuff, just pure node.js stuff
// ---------------------------------------

const events = require("events");

// inherit
class Person extends events.EventEmitter {
  constructor(name) {
    // super(): initialize parent constructor
    super();
    this.name = name;
  }
}

let james = new Person("james");
let john = new Person("john");
let people = [james, john];

// add event listener to each person
// listen on the 'speak' event
people.forEach((person) => {
  person.on("speak", (msg) => {
    console.log(person.name + " said: " + msg);
  });
});

// raise event
// the second argument will be passed to the callback function
james.emit("speak", "hey man..."); // james said: hey man...
john.emit("speak", "what is uppppp..."); // john said: what is uppppp...
