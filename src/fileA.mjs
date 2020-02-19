import { returnDateTime } from "./fileB.mjs";
import { logDate } from "./fileC.mjs";

const main = () => {
  const date = returnDateTime();
  logDate(date);
};

main();
