// ESM circ deps: only works with index. see circle_deps_example/
// import { logger } from "./index.mjs";

import { logger } from "./fileD.mjs";

const logIt = text => {
  logger(text);
};

export { logIt };
