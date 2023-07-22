#!/usr/bin/env node
const { run } = require("../dist/scripts.js");
const arg = require("arg");

// parse the arguments passed by user
const args = arg(
  {
    // Types
    "--username": String,
    "--years": String,
    "--path": String,

    // Aliases
    "-u": "--username",
    "-y": "--years",
    "-p": "--path",
  },
  { argv: process.argv }
);

if (!args["--username"]) {
  throw new Error("missing required argument: --username or -u");
}

args["--years"] = args["--years"]?.split(",");

const { ["--username"]: username, ["--years"]: years, ["--path"]: path } = args;

run({ username, years, path });
