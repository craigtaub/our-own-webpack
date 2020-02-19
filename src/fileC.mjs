import { logger } from "./fileD.mjs";

const logDate = text => {
  logger(`The date is: ${text}`);
};

export { logDate };
