import { load } from "cheerio";
import { ContributionItem } from "../contribution/index";
import { signal, sortByDate, __fetch } from "../util";

// only support querying by each year.
function getContributionUrl(username: string, year?: string) {
  const query = year ? `?from=${year}-01-01` : "";
  return `https://github.com/users/${username}/contributions${query}`;
}

// maybe need to set headers here.
async function fetchHtml(url: string) {
  const res = await __fetch(url);
  return res.text();
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
    `It have been extracted successfully that [${
      contributions.length
    }] contribution items in [${year || "last year"}]`
  );
  return contributions;
}
