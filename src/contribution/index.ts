import { crawl } from "../crawler";

export interface ContributionItem {
  date: Date;
  value: string;
}

export interface Contributions {
  lastYear?: ContributionItem[];
  [key: string]: ContributionItem[] | undefined;
}

export class GithubContribution {
  // TODO: support merge contributions

  // static mergeContributions(contributions: Contributions) {
  // }

  private username: string;
  private allContributions: Contributions;
  private beforeCallbacks: Array<() => void>;
  private afterCallbacks: Array<() => void>;

  constructor(username: string) {
    this.username = username;
    this.allContributions = {};
    this.beforeCallbacks = [];
    this.afterCallbacks = [];
  }

  public get data() {
    return this.allContributions;
  }

  public subscribe = (hook: () => void, before?: boolean) => {
    const target = before ? this.beforeCallbacks : this.afterCallbacks;
    target.push(hook);

    return () => {
      const index = target.indexOf(hook);
      target.splice(index, 1);
    };
  };

  public crawl = async (year?: string) => {
    this._performCallbacks(this.beforeCallbacks);

    const result = await crawl(this.username, year);

    this._performCallbacks(this.afterCallbacks);

    this._setContributions(result, this._isValidYear(year) ? year : "lastYear");

    return this.data;
  };

  public crawlYears = async (years: string[] = []) => {
    await Promise.all(years.map(this.crawl));
    return this.data;
  };

  private _isValidYear(year?: string) {
    return typeof year === "string" && /^\d+$/.test(year);
  }

  private _performCallbacks(callbacks: Array<() => void>) {
    callbacks.forEach((func) => {
      func();
    });
  }

  private _setContributions(
    contributionsOfOneYear: ContributionItem[],
    key?: keyof Contributions
  ) {
    const _key = key || new Date().getFullYear();
    this.allContributions[_key] = contributionsOfOneYear;
  }
}
