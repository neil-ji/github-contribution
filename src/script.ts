import { GithubContribution, generateJsonFile } from "./";

interface RunOptions {
  username: string;
  years?: string | string[];
  path?: string;
}

export default async function run(options: RunOptions) {
  const gc = new GithubContribution(options.username);

  if (Array.isArray(options.years)) {
    await gc.crawlYears(options.years);
  } else {
    await gc.crawl(options.years);
  }

  await generateJsonFile(JSON.stringify(gc.getContributions()), options.path);
}
