import { load } from "cheerio";
import { ContributionItem } from "../index";

// only support querying by each year.
function getContributionUrl(username: string, year?: string) {
  const query = year ? `?from=${year}-01-01` : "";
  return `https://github.com/users/${username}/contributions${query}`;
}

// maybe need to set headers here.
async function fetchHtml(url: string) {
  const headers = {};
  const res = await fetch(url, { headers });
  const html = await res.text();
  return html;
}

async function extractContributions(html: string): Promise<ContributionItem[]> {
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

  console.log(contributions);

  return contributions;
}

export async function crawl(
  username: string,
  year?: string
): Promise<ContributionItem[]> {
  const url = getContributionUrl(username, year);
  const html = await fetchHtml(url);
  return extractContributions(html);
}
