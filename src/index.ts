import { GithubContribution } from "./contribution";
import { generateJsonFile } from "./util/index";

async function run(username: string, years?: string | string[]) {
  const gc = new GithubContribution(username);

  if (Array.isArray(years)) {
    await gc.crawlYears(years);
  } else {
    await gc.crawl(years);
  }

  await generateJsonFile(JSON.stringify(gc.getContributions()), "./dist/");
}

run("neil-ji", "2022");
