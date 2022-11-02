const { stdin, stdout } = require("process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const EventEmmiter = require("events");

const rl = readline.createInterface({ input: stdin, output: stdout });
const emitter = new EventEmmiter();

emitter.on("write", (data) => {
  fs.appendFile(
    path.join(__dirname, "log.txt"),
    data ? `${data}\n` : data,
    (err) => {
      if (err) throw err;
    }
  );
});

rl.on("line", (input) => {
  if (input.toLowerCase() === "exit") {
    console.log("Nevermind...");
    rl.close();
  } else {
    emitter.emit("write", input);
  }
});

rl.on("SIGINT", () => {
  console.log("Meh, nevermind...");
  rl.close();
});

emitter.emit("write", "");
console.log("Type something, please...");
