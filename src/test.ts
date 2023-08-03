import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { join } from "path";
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
  path?: string;
}

async function run(options: RunOptions) {
  const inst = new GithubContribution(options.username);

  const unsubscribe = inst.subscribe(applyProxyAgent, true);

  if (Array.isArray(options.years)) {
    await inst.crawlYears(options.years);
  } else {
    await inst.crawl(options.years);
  }

  const filename = await generateJsonFile(
    JSON.stringify(inst.data),
    options.path
  );

  unsubscribe();
}

const p = join(process.cwd(), "dist", "contributions");

console.log(p);

run({
  username: "neil-ji",
  // years: ["2023", "2022", "2021"],
  path: p,
});
