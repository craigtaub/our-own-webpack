// ESM circ deps: only works with index. see circle_deps_example/
// import { logger } from "./index.mjs";

const logger = text => {
  console.log(text);
};

const logIt = text => {
  logger(text);
};

export { logIt };
