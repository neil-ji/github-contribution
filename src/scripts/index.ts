import { GithubContribution } from "../contribution";
import { generateJsonFile } from "../util";

interface RunOptions {
  username: string;
  years?: string | string[];
  path?: string;
}

export async function run(options: RunOptions) {
  const inst = new GithubContribution(options.username);

  if (Array.isArray(options.years)) {
    await inst.crawlYears(options.years);
  } else {
    await inst.crawl(options.years);
  }

  await generateJsonFile(JSON.stringify(inst.data), options.path);
}
