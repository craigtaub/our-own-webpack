import path from "path";
import fs from "fs";
import ast from "abstract-syntax-tree";

const depsArray = [];

const depsGraph = (file, firstRun = false) => {
  // TODO: locally doesnt add /src/ so needs it. relates to CWD.
  const fullPath = path.resolve(firstRun ? file : file.replace("./", "./src/"));

  // return early if exists
  if (!!depsArray.find(item => item.name === fullPath)) return;

  // create "module"
  const module = { name: fullPath };

  // parse file source
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const source = ast.parse(fileContents);
  module.source = source;

  // process deps
  source.body.reduce((agg, current) => {
    if (current.type === "ImportDeclaration") {
      const file = path.resolve(current.source.value.replace("./", "./src/"));
      // store dep full path
      agg.push(file);
      // process module for each dep.
      depsGraph(file);
    }
    return agg;
  }, []);

  // Add module to deps array
  depsArray.push(module);

  return depsArray;
};

export { depsGraph };
