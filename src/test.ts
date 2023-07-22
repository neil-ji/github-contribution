import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { generateJsonFile, injectFetch, GithubContribution } from "./";

function applyProxyAgent() {
  const agent = new HttpsProxyAgent("http://127.0.0.1:7890");

  function myFetch(input: any, init: any) {
    return fetch(input, {
      ...init,
      agent,
    });
  }
  injectFetch(myFetch as any);
}

interface RunOptions {
  username: string;
  years?: string | string[];
  file?: string;
  dir?: string;
}

async function run(options: RunOptions) {
  const gc = new GithubContribution(options.username);

  const unsubscribe = gc.subscribe(applyProxyAgent, true);

  if (Array.isArray(options.years)) {
    await gc.crawlYears(options.years);
  } else {
    await gc.crawl(options.years);
  }

  await generateJsonFile(
    JSON.stringify(gc.getContributions()),
    options.dir,
    options.file
  );

  unsubscribe();
}

run({
  username: "neil-ji",
  years: ["2022", "2021"],
  dir: "./dist",
  file: "contribution",
});
