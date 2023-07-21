import { crawl } from "../crawler";

export interface ContributionItem {
  date: Date;
  value: string;
}

export interface Contributions {
  lastYear?: ContributionItem[];
  [key: string]: ContributionItem[] | undefined;
}

//TODO: support cache.
export class GithubContribution {
  // TODO: support merge contributions
  // static mergeContributions(contributions: Contributions) {
  // }

  private username: string;
  private allContributions: Contributions;

  constructor(username: string) {
    this.username = username;
    this.allContributions = {};
  }

  public getContributions() {
    return this.allContributions;
  }

  public setContributions(
    contributionsOfOneYear: ContributionItem[],
    key?: keyof Contributions
  ) {
    const _key = key || new Date().getFullYear();
    this.allContributions[_key] = contributionsOfOneYear;
  }

  public async crawl(year?: string) {
    const result = await crawl(this.username, year);

    if (this._isValidYear(year)) {
      this.setContributions(result, year);
    } else {
      this.setContributions(result, "lastYear");
    }

    return result;
  }

  public async crawlYears(years: string[] = []) {
    const result = await Promise.all(years.map(this.crawl));
    return result;
  }

  public async crawlFrom(year?: string, maxYears: number = 20) {
    if (!this._isValidYear(year)) return this.crawl();

    let count = maxYears;
    let start = Number(year);
    const end = new Date().getFullYear();

    while (start < end && count < maxYears) {
      this.crawl(String(start));
      start++;
      count++;
    }
  }

  private _isValidYear(year?: string) {
    return typeof year === "string" && /^\d+$/.test(year);
  }
}
