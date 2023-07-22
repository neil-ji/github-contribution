#!/usr/bin/env node
const run = require("../dist/run");
const arg = require("arg");

// parse the arguments passed by user
const args = arg(
  {
    // Types
    "--username": String,
    "--file": String,
    "--dir": String,
    "--years": String,

    // Aliases
    "-u": "--username",
    "-f": "--file",
    "-d": "--dir",
    "-y": "--years",
  },
  { argv: process.argv }
);

if (!args["--username"]) {
  throw new Error("missing required argument: --name");
}

args["--years"] = args["--years"]?.split(",");

const {
  ["--username"]: username,
  ["--file"]: file,
  ["--dir"]: dir,
  ["--years"]: years,
} = args;

run({ username, years, file, dir });
