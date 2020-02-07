import { returnTime } from "./index.mjs";
import { logIt } from "./index.mjs";

const main = () => {
  const time = returnTime();
  logIt(time);
};

const logger = text => {
  console.log(text);
};

export { logger, main };
