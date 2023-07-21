# github-contribution

A simple and flexible Nodejs library for fetching your github contribution stats.

## About Github Contributions

[Your contributions, including commits, proposed pull requests, and opened issues, are displayed on your profile so people can easily see the work you've done.](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)

By the way, there have no direct ways to get the contribution stats, instead, it is derived by `commits, pull requests, issues, etc.`, hence we have no choice but calculate it by counting those metrics. In this way, you have to create a github token, and getting the raw data from Github through Github RESTful Api(or `octokit`), then calculate your contributions by yourself.

Is there really have no another simple choice? No, we have a hack method to get it: crawling the html from personal github homepage. In this way, our library will be simple but unstable because of we have to update our crawler every time when github updates their html structure.

Sum up, I have implement some functions of the second one, but you shouldn't hold too much wish on its stability.

## Limitation

Because `github.com` have a strict [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/web/http/csp), we cannot fetch the github html from any cross-origin site in the modern browser. For bypassing this limitation implemented by modern browsers, We have to run the fetch code in a non-browser environment, such as Node.js.

For some reasons above, this library only support for `Node.js`.

## Install

Ensure you have install `Node.js@latest`, then run command below.

```bash
npm install github-contribution
```

## Usage

### Basic usage.

```ts
import { GithubContribution } from "github-contribution";

const instance = new GithubContribution("your github owner name");

instance.crawl().then((contributionItems) => {
    // do some thing
})
```

### Crawl and then generate a json file

```ts
import { GithubContribution, generateJsonFile } from "github-contribution";

const instance = new GithubContribution("your github owner name");

instance.crawl().then((contributionItems) => {
    // do some thing
})

generateJsonFile(instance.getContributions(), "directory", "file name");
```
No need to pass file name like `"xxxxx.json"`, the function will append `.json` automatically.

### Use github-contribution with Cli

```bash
githubc generate --dir="" --filenam=""
```

It's useful when you integrate `github-contribution` into Github Actions or local scripts, for example, you can define a scripts pipeline by `npm-run-all`.

There is a example:

```ts
TODO: add a example
```