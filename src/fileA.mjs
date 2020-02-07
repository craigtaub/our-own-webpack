import { returnTime } from "./fileB.mjs";
import { logIt } from "./fileC.mjs";

const main = () => {
  const time = returnTime();
  logIt(time);
};

main();
// const craigTime = _ourRequire("{ID}");
