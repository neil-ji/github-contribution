# github-contribution

[English Document](/README.md)

一个简单而灵活的 Nodejs 库，用于获取 github 贡献统计数据。

[![npm](https://img.shields.io/npm/v/github-contribution)](https://badge.fury.io/js/github-contribution) ![GitHub top language](https://img.shields.io/github/languages/top/neil-ji/github-contribution) [![GitHub Repo stars](https://img.shields.io/github/stars/neil-ji/github-contribution?label=Github%20stars)
](https://github.com/neil-ji/github-contribution)

## 前言

在使用 `github-contribution` 之前请阅读以下内容：

- [关于 Github Contribution 的说明](#about-github-contributions)
- 仅支持 Nodejs，原因请参见[限制](#limitations)。

## 安装

在运行以下命令之前，请确保您已安装`Node.js@latest`。

```bash
npm install github-contribution
```

## 使用

### 基础用法 (支持 Typescript)

使用 Promise 处理数据：

```ts
import { GithubContribution } from "github-contribution";

const instance = new GithubContribution("your github owner name");

instance.crawl().then((data) => {
  // do something
});
```

`data` 结构示例：

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

建议将所有代码包装到异步函数中：

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const data = await instance.crawl();

  return data.lastYear; // equal to instance.data.lastYear
}
```

默认爬取去年（从今天开始）一年的数据，你也可以指定某一年从 1 月 1 号到 12 月 31 号的 Github Contribution 数据：

```ts
async function myContributionsCrawler(username: string) {
  const instance = new GithubContribution(username);

  const data = await instance.crawl("2023");

  return data;
}
```

### 爬取并生成 JSON 文件

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

你可以在[Path - Node.js v18.17.0](https://nodejs.org/dist/latest-v18.x/docs/api/path.html)找到有关如何使用 Nodejs 内置模块`path`的详细信息。

注意：默认情况下，会自动设置扩展名`.json`，你指定的其他扩展名如`.js, .txt`等将被初始化成`.json`。

### 通过控制台指令使用 `github-contribution`

它会自动抓取并生成 json 文件。

当你尝试将 `github-contribution` 集成到 Github Actions 或本地脚本中时，它非常有用。

### 全局安装 VS 本地安装

如果你想全局安装`github-contribution`，运行下面的命令：

```bash
npm install github-contribution -g
```

这样就可以直接运行`crawl -u "your name"`了。

如果你选择本地安装（也就是删除`-g`指令），那么必须在 `package.json` 中配置一个 npm 脚本，如下所示：

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

此时，运行命令 `npm run crawl -u "your name"`，等价于 `crawl -u "your name"`。

查看有关 NPM “全局安装 VS 本地安装” 的更多详细信息：

- [Downloading and installing packages locally](https://docs.npmjs.com/downloading-and-installing-packages-locally)
- [Downloading and installing packages globally](https://docs.npmjs.com/downloading-and-installing-packages-globally)

### 控制台指令

基础用法，用户名是必须的:

```bash
crawl --username "your-name"
```

使用更便捷的简写指令(`--username = -u, --years = -y, --path = -p`):

```bash
crawl -u "your-name"
```

可以指定 json 文件的路径，默认路径是你项目的根路径，文件名为 `github-contributions.json`:

```bash
crawl -u "your-name" -p "/your-path/your-filename.json"
```

指定 Github Contribution 时间范围，默认为最近一年（从今天开始）:

```bash
crawl -u "your-name" -p "your-path" -y "2023,2022,2021"
```

建议在你确实需要时再指定额外参数:

- `--username, -u`: your github username.
- `--years, -y`: time range for your contributions, and split multiple years by `,`, for example:`2021,2022,2023`.
- `--path, -p`: specify path of generated json file, it's recommended using `path.join` to normalize your path string.

## Advanced Usage

示例 1：通过代理获取。

对于一些无法直接与 github 服务器建立稳定连接的人（例如：国内直接访问 github 很不稳定）来说这很有用。

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

示例 2：通过基本 api `crawl(username: string,year?: string): Promise<ContributionItem[]>` 定制化你的需求。

## About Github Contributions

[您的贡献（包括提交、提议的拉取请求和打开的问题）将显示在您的个人资料中，以便人们可以轻松查看您所做的工作。](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)

目前无法通过 Github Restful API 来获取贡献统计数据，只能是通过“commits 、pull requests、issue 等”派生出来 github contribution，因此我们别无选择，只能通过统计这些指标来计算。

但这样，你就必须创建一个 github token，并通过 Github RESTful Api（或`octokit`）从 Github 获取原始数据，然后自己计算 contribution。

难道真的没有其他简单的选择吗？ 不，我们有一个 hack 方法来获取它：从个人 github 主页爬取 html。

这样，我们的库会很简单，但不稳定，因为每次 github 更新其 html 结构时，我们都必须更新我们的爬虫。

总而言之，在该库支持通过 Github RESTful Api 获取和计算贡献之前，您不应该对其稳定性抱有太大希望。

## Limitations

因为 `github.com` 有严格的[内容安全策略 (CSP)](https://developer.mozilla.org/en-US/docs/web/http/csp)，所以我们无法从任何跨源页面上获取 github 的 html，除非是某些未实现 CSP 控制的远古浏览器。

为了绕过现代浏览器实现的这一限制，我们必须在非浏览器环境（例如 Node.js）中运行爬虫。

由于上述某些原因，该库仅支持“Node.js”。
