import path from "path";
import fs from "fs";
import exprima from "esprima"; // tokenize

const main = () => {
  const depsArray = [];
  const entry = "./src/fileA.mjs";
  const fullPath = path.resolve(entry);
  // console.log("full path", fullPath);

  // check exists
  const exists = !!depsArray.find(item => item.name === fullPath);
  if (exists) {
    return;
  }

  // create module
  const module = {
    name: fullPath
  };

  // process file
  const fileContents = fs.readFileSync(fullPath, "utf8");
  console.log(fileContents);
  const parsed = exprima.parseScript(fileContents);
  console.log(parsed);
};

main();
