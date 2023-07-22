# github-contribution

A simple and flexible Nodejs library for fetching your github contribution stats.

[![npm](https://img.shields.io/npm/v/github-contribution)](https://badge.fury.io/js/github-contribution) ![GitHub top language](https://img.shields.io/github/languages/top/neil-ji/github-contribution) [![GitHub Repo stars](https://img.shields.io/github/stars/neil-ji/github-contribution?label=Github%20stars)
](https://github.com/neil-ji/github-contribution)

## Preface

Please read below before you have a try of `github-contribution`:

- [About Github Contributions](#about-github-contributions)
- Only support Nodejs, see the reason at [Limitations](#limitations).
- Follow the [Usage guidelines](#usage), it's simple that just passing your owner name and getting your contributions directly, by the way, it's simple also that generating a json file by use the exported function `generateJsonFile`.

## Install

Ensure you have installed `Node.js@latest` before run the bellow command.

```bash
npm install github-contribution
```

## Usage

### Basic usage(Support Typescript)

```ts
import { GithubContribution } from "github-contribution";

const instance = new GithubContribution("your github owner name");

// Note: contributionItems is not equal instance.getContributions(), see details at section Definitions.
instance.crawl().then((contributionItems) => {
  console.log(instance.getContributions());
});
```

It's recommended that wrap all the codes into an async function:

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const intermediateData = await instance.crawl();

  return instance.getContributions().lastYear;
}
```

It will crawl the last year(start at today), maybe you want to specify the full year(s) of your contributions:

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const intermediateData = await instance.crawl("2023");

  return instance.getContributions()["2023"];
}
```

### Crawl and generate a json file

```ts
import { GithubContribution, generateJsonFile } from "github-contribution";
import { join } from "path";

const instance = new GithubContribution("your github owner name");

instance.crawl().then((contributionItems) => {
  generateJsonFile(
    instance.getContributions(),
    join(__dirname, "dist", "myContributions")
  );
});
```

You can find the details about how to use the nodejs built-in module 'path' at [Path - Node.js v18.17.0](https://nodejs.org/dist/latest-v18.x/docs/api/path.html).

Note: by default, an extension name '.json' will be set automatically, and if you specify another one such as '.js', '.txt', etc., it will be reset to '.json'.

### Use `github-contribution` with CLI

It's useful when you integrate `github-contribution` into Github Actions or local scripts.

```bash
githubc run --username "your name" --years "2023,2022,2021" --path "your path"
```

or use the Abbr arguments:

```bash
githubc run -u "your name" -y "2023,2022,2021" -p "your path"
```

Fell free about the optional arguments `--path` and `--years` that they have a default value, and you can use it like this:

```bash
githubc run -u "your name"
```

enough simple, right? It's recommended specifying other arguments while you really need it.

## Definitions

### class `GithubContribution`

public method of `GithubContribution` at bellow.

```ts
class GithubContribution {
  constructor(username: string);
  getContributions: () => Contributions;
  subscribe: (hook: () => void, before?: boolean) => () => void;
  crawl: (year?: string) => Promise<ContributionItem[]>;
  crawlYears: (years?: string[]) => Promise<ContributionItem[][]>;
  crawlFrom: (
    year?: string,
    maxYears?: number
  ) => Promise<ContributionItem[] | undefined>;
}
```

### type of `Contributions`

Access contributions use `getContributions`.

If you specify `year(s)`, it will crawl contributions of each years and the corresponding years will be set as keys, for example: `{ 2023: [...contributions...] }`

If you do not pass a valid parameter `year`, it will crawl the contributions of last year by default, you can access it use the key `lastYear`.

```ts
interface ContributionItem {
  date: Date;
  value: string;
}

interface Contributions {
  lastYear?: ContributionItem[];
  [key: string]: ContributionItem[] | undefined;
}
```

## About Github Contributions

[Your contributions, including commits, proposed pull requests, and opened issues, are displayed on your profile so people can easily see the work you've done.](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)

By the way, there have no direct ways to get the contribution stats, instead, it is derived by `commits, pull requests, issues, etc.`, hence we have no choice but calculate it by counting those metrics. In this way, you have to create a github token, and getting the raw data from Github through Github RESTful Api(or `octokit`), then calculate your contributions by yourself.

Is there really have no another simple choice? No, we have a hack method to get it: crawling the html from personal github homepage. In this way, our library will be simple but unstable because of we have to update our crawler every time when github updates their html structure.

Sum up, you shouldn't hold too much wish on its stability until this lib supports fetching and calculating contributions by Github RESTful Api.

## Limitations

Because `github.com` have a strict [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/web/http/csp), we cannot fetch the github html from any cross-origin site in the modern browser. For bypassing this limitation implemented by modern browsers, We have to run the fetch code in a non-browser environment, such as Node.js.

For some reasons above, this library only support for `Node.js`.
