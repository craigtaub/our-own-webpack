import path from "path";
import fs from "fs";
import ast from "abstract-syntax-tree";

const depsArray = [];

const depsGraph = (file, firstRun = false) => {
  // TODO: locally doesnt add /src/ so needs it. relates to CWD.
  const fullPath = path.resolve(firstRun ? file : file.replace("./", "./src/"));

  // return early if exists
  const exists = !!depsArray.find(item => item.name === fullPath);
  if (exists) return;

  // create "module"
  const module = {
    name: fullPath
  };

  // parse file source
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const source = ast.parse(fileContents);
  module.source = source;

  // create deps
  const deps = source.body.reduce((agg, current) => {
    if (current.type === "ImportDeclaration") {
      // store dep full path
      agg.push(path.resolve(current.source.value.replace("./", "./src/")));
    }
    return agg;
  }, []);
  module.deps = deps;

  // Add module to deps array
  depsArray.push(module);

  // Process module for each dep.
  module.deps.map(file => {
    // Recursively call
    depsGraph(file);
  });

  return depsArray;
};

export { depsGraph };
