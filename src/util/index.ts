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
