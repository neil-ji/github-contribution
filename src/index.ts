import { GithubContribution } from "./contribution";
import { generateJsonFile } from "./util/index";

async function run(username: string, years?: string | string[]) {
  const gc = new GithubContribution(username);

  if (Array.isArray(years)) {
    await gc.crawlYears(years);
  } else {
    await gc.crawlFrom(years);
  }

  await generateJsonFile(JSON.stringify(gc.getContributions()));
}

run("neil-ji");
