export enum CacheMode {
  LocalStorage = 1,
  SessionStorage = 2,
}

export interface CacheOptions {
  mode?: CacheMode;
  expires?: Date;
  key?: string;
  value: string | object;
}

function isExpired(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.valueOf() <= Date.now();
}

function toJson(target?: string | object) {
  return typeof target === "string" ? target : JSON.stringify(target);
}

function normalizeCachedValue(value: string, date?: Date) {
  return `${value};expires:${(date || new Date()).toJSON()}`;
}

function cacheInLocal(key: string, value: string | object, expires?: Date) {
  const localCache = localStorage.getItem(key);

  if (!localCache || /expires:(.*)$/.test(localCache) || isExpired(RegExp.$1)) {
    localStorage.setItem(key, normalizeCachedValue(toJson(value), expires));
  }

  return key;
}

function cacheInSession(key: string, value: string | object) {
  const sessionCache = sessionStorage.getItem(key);
  if (!sessionCache) {
    sessionStorage.setItem(key, toJson(value));
  }
  return key;
}

export function cache(options: CacheOptions): string {
  const { mode, key, value, expires } = options;

  const nonNullKey = key || "GITHUB_CONTRIBUTION";

  if (mode === CacheMode.LocalStorage) {
    return cacheInLocal(nonNullKey, value, expires);
  }

  return cacheInSession(nonNullKey, value);
}
