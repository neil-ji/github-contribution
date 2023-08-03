import { open } from "fs/promises";
import { isAbsolute, join, parse, ParsedPath } from "path";
import signale from "signale";

export const signal = signale;

const normalizeJsonPath = (path?: ParsedPath | string): string => {
  if (!path) return join(process.cwd(), "contributions.json");

  const parsedPath =
    typeof path === "string"
      ? parse(isAbsolute(path) ? path : join(process.cwd(), path))
      : path;

  const copy = { ...parsedPath };

  if (!copy.name) {
    copy.name = "contributions";
  }

  if (copy.ext !== ".json") {
    copy.ext = ".json";
    copy.base = copy.name + ".json";
  }

  return join(copy.dir, copy.base);
};

// generate JSON file from the string data.
export const generateJsonFile = async (
  json: string,
  path?: ParsedPath | string
) => {
  const _path = normalizeJsonPath(path);

  let filehandle;
  try {
    filehandle = await open(_path, "w");
    await filehandle.write(Buffer.from(json));
    signal.success(`${_path} has been generated successfully`);
  } catch (error) {
    signal.fatal(error);
  } finally {
    filehandle?.close();
  }

  return _path;
};

export const sortByDate = <T>(
  data: Array<T>,
  mapDate: (dta: T) => Date,
  desc?: boolean
) => {
  data.sort((a, b) => {
    const sortTag = mapDate(a).valueOf() > mapDate(b).valueOf();
    return !desc && sortTag ? 1 : -1;
  });
};

// inject node-fetch or any else fetch implements to instead of native fetch
// Reasons: use node-fetch to set a proxy preventing connection timeout.
interface FetchFunc {
  (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

let fetchFunc: FetchFunc = fetch;
export function injectFetch(_fetch: FetchFunc): void {
  fetchFunc = _fetch || fetch;
}

export const __fetch: FetchFunc = (input, init) => {
  return fetchFunc(input, init);
};
