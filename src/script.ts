#!/usr/bin/env node

import { GithubContribution, generateJsonFile } from "./";
import arg from "arg";

async function run(username: string, years?: string | string[]) {
  const gc = new GithubContribution(username);

  if (Array.isArray(years)) {
    await gc.crawlYears(years);
  } else {
    await gc.crawl(years);
  }

  await generateJsonFile(JSON.stringify(gc.getContributions()), "./dist/");
}

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
  {
    argv: `npm run exec -u="neil-ji" --file "contributions" -d "./dist" -y "2020,2021,2022"`.split(
      " "
    ),
  }
);

if (!args["--username"]) {
  throw new Error("missing required argument: --name");
}

(args["--years"] as any) = args["--years"]?.split(",");

const {
  ["--username"]: uname,
  ["--file"]: fname,
  ["--dir"]: dir,
  ["--years"]: years,
} = args;

run(uname, years);

console.log(args);

// run("neil-ji", "2022");
