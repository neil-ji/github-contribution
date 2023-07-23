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

Use promise handle the data:

```ts
import { GithubContribution } from "github-contribution";

const instance = new GithubContribution("your github owner name");

instance.crawl().then((data) => {
  // do something
});
```

`data` structure example:

```ts
{
  lastYear: [
    {date: Date, value: string},
    {date: Date, value: string},
    // ...
  ],
  "2023": [
    {date: Date, value: string},
    {date: Date, value: string},
    // ...
  ],
  // ...
}
```

It's recommended that wrap all the codes into an async function:

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const data = await instance.crawl();

  return data.lastYear; // equal to instance.data.lastYear
}
```

It will crawl the last year(start at today), maybe you want to specify the full year(s) of your contributions:

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const intermediateData = await instance.crawl("2023");

  return instance.data["2023"];
}
```

### Crawl and generate a json file

```ts
import { GithubContribution, generateJsonFile } from "github-contribution";
import { join } from "path";

async function run(username: string) {
  const instance = new GithubContribution(username);

  const data = await instance.crawl("2023");

  const path = join(__dirname, "dist", "myContributions");

  const filename = await generateJsonFile(data, path);

  return filename;
}
```

You can find the details about how to use the nodejs built-in module 'path' at [Path - Node.js v18.17.0](https://nodejs.org/dist/latest-v18.x/docs/api/path.html).

Note: by default, an extension name '.json' will be set automatically, and if you specify another one such as '.js', '.txt', etc., it will be reset to '.json'.

### Use `github-contribution` with CLI

It will crawl and generate a json file automatically.

It's useful while you try to integrate `github-contribution` into Github Actions or local scripts.

### Global installation VS Local Installation

If you want to install `github-contribution` global, run command below, and in this way, you can run `crawl -u "your name"` directly:

```bash
npm install github-contribution -g
```

If you install it locally(remove `-g`), then you have to config a npm script in your `package.json`, like this:

```json
{
  "name": "github-contribution-test",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    // look at here
    "crawl": "crawl"
  },
  "author": ""
}
```

Run the command `npm run crawl -u "your name"`, it is equal to `crawl -u "your name"` now.

See more details about Global VS Local:

- [Downloading and installing packages locally](https://docs.npmjs.com/downloading-and-installing-packages-locally)
- [Downloading and installing packages globally](https://docs.npmjs.com/downloading-and-installing-packages-globally)

### CLI Usage

basic usage:

```bash
crawl --username "your-name"
```

or use the Abbr arguments(`--username = -u, --years = -y, --path = -p`):

```bash
crawl -u "your-name"
```

specify path of the json file, default path is your project root path and filename is `github-contributions.json`:

```bash
crawl -u "your-name" -p "/your-path/your-filename.json"
```

specify range of the contributions, default is last year:

```bash
crawl -u "your-name" -p "your-path" -y "2023,2022,2021"
```

enough simple, right? It's recommended specifying arguments while you really need it:

- `--username, -u`: your github username.
- `--years, -y`: time range for your contributions, and split multiple years by `,`, for example:`2021,2022,2023`.
- `--path, -p`: specify path of generated json file, it's recommended using `path.join` to normalize your path string.

## Advanced Usage

Example 1: fetch through proxy.

It's useful for some people which cannot establish connection directly with github server.

```ts
import { injectFetch } from "github-contribution";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

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

const inst = new GithubContribution(options.username);

const unsubscribe = inst.subscribe(applyProxyAgent, true);
```

Example 2: create your GithubContribution class by base api `crawl(username: string, year?: string): Promise<ContributionItem[]>`

## About Github Contributions

[Your contributions, including commits, proposed pull requests, and opened issues, are displayed on your profile so people can easily see the work you've done.](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)

By the way, there have no direct ways to get the contribution stats, instead, it is derived by `commits, pull requests, issues, etc.`, hence we have no choice but calculate it by counting those metrics. In this way, you have to create a github token, and getting the raw data from Github through Github RESTful Api(or `octokit`), then calculate your contributions by yourself.

Is there really have no another simple choice? No, we have a hack method to get it: crawling the html from personal github homepage. In this way, our library will be simple but unstable because of we have to update our crawler every time when github updates their html structure.

Sum up, you shouldn't hold too much wish on its stability until this lib supports fetching and calculating contributions by Github RESTful Api.

## Limitations

Because `github.com` have a strict [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/web/http/csp), we cannot fetch the github html from any cross-origin site in the modern browser. For bypassing this limitation implemented by modern browsers, We have to run the fetch code in a non-browser environment, such as Node.js.

For some reasons above, this library only support for `Node.js`.
