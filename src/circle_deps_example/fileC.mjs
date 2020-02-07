// ESM circ deps: Works with index
import { logger } from "./index.mjs";

// ESM circ deps: Not needed with index
// const logger = text => {
//   console.log(text);
// };

const logIt = text => {
  logger(text);
};

export { logIt };
