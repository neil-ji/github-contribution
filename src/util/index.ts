import { open } from "fs/promises";
import signale from "signale";

export const signal = signale;

// generate JSON file from the string data.
export const generateJsonFile = async (
  json: string,
  dir: string = __dirname,
  name: string = "github.contributions"
) => {
  let filehandle;

  const src = `${dir}${name}.json`;

  try {
    filehandle = await open(src, "w");
    await filehandle.write(Buffer.from(json));
    signal.success(`${src} has been generated successfully`);
  } catch (error) {
    signal.fatal(error);
  } finally {
    filehandle?.close();
  }

  return src;
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
