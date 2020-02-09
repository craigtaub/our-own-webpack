import path from "path";
import fs from "fs";
import ast from "abstract-syntax-tree";
import { eventEmitter } from "./lifecycle.mjs";

const depsArray = [];

const depsGraph = (file, firstRun = false) => {
  eventEmitter.emit("build_graph");

  // TODO: locally doesnt add /src/ so needs it. relates to CWD.
  const fullPath = path.resolve(firstRun ? file : file.replace("./", "./src/"));

  // check exists
  const exists = !!depsArray.find(item => item.name === fullPath);
  if (exists) {
    // early exit. Important for recursion.
    return;
  }

  // create module
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
      agg.push(current.source.value);
    }
    return agg;
  }, []);
  module.deps = deps;

  // Add module to deps array
  depsArray.push(module);
  // console.log(module);

  // Process module for each dep.
  module.deps.map(file => {
    // Recursively call
    depsGraph(file);
  });

  eventEmitter.emit("returned_graph");
  return depsArray;
};

export { depsGraph };
