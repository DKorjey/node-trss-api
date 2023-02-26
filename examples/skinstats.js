// Here example how getSkinById() and getLike() works
// User writes id of the skin, and programm write skin stats

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output, exit } from "process";
import { getSkinById } from "../index.js"; // P.S. In real code use "node-trss-api" instead of "../index.js"

function fromUpper(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

const rl = readline.createInterface({ input, output });

const id = parseInt(await rl.question("Enter skin id: "));

rl.close();

if (isNaN(id)) {
  console.log("Enter a number in next time");
  exit(1);
}

const skinStats = await getSkinById(id)

console.log("Result: ")

for (const k in skinStats) {
  console.log(fromUpper(k).replace(/_/g, " ") + ": " + skinStats[k])
}

console.log("Self-like: ", getLike(skinStats.author_id, id) ? "Yes" : "No")
