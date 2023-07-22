import { load } from "cheerio";
import { ContributionItem } from "../contribution/index";
import { signal, sortByDate } from "../util";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

function generateAgent() {
  return new HttpsProxyAgent("http://127.0.0.1:7890");
}

// only support querying by each year.
function getContributionUrl(username: string, year?: string) {
  const query = year ? `?from=${year}-01-01` : "";
  return `https://github.com/users/${username}/contributions${query}`;
}

// maybe need to set headers here.
async function fetchHtml(url: string) {
  const headers = {};
  const res = await fetch(url, { headers, agent: generateAgent });
  const html = await res.text();
  return html;
}

function extractContributions(html: string): ContributionItem[] {
  const pattern = /^\d*/;
  const $ = load(html);
  const contributions: ContributionItem[] = $("table tbody tr td")
    .filter((_, el) => $(el).data("ix") !== undefined)
    .map((_, el) => {
      const date = $(el).data("date") as string;
      const matchedValue = $(el, "span").text().match(pattern);
      const value =
        matchedValue && matchedValue[0] !== "" ? matchedValue[0] : "0";
      return {
        date: new Date(date),
        value,
      };
    })
    .toArray();

  // default sort as asc
  sortByDate(contributions, (item) => item.date);

  return contributions;
}

export async function crawl(
  username: string,
  year?: string
): Promise<ContributionItem[]> {
  const url = getContributionUrl(username, year);
  const html = await fetchHtml(url);
  const contributions = extractContributions(html);
  signal.success(
    `${contributions.length} contribution items have been extracted successfully`
  );
  return contributions;
}
