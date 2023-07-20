import { crawl } from "./crawler";

export interface ContributionItem {
  date: Date;
  value: string;
}

export interface Contributions {
  [key: string]: ContributionItem[];
}

//TODO: support cache.
export class GithubContribution {
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
    year?: string
  ) {
    const key = year || new Date().getFullYear();
    this.allContributions[key] = contributionsOfOneYear;
  }

  public async crawl(year?: string) {
    const result = await crawl(this.username, year);
    this.setContributions(result, year);
    return result;
  }

  public async crawlYears(years: string[] = []) {
    if (!years.every(this._isValidYear)) return this.crawl();

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
