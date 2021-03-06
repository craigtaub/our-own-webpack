import path from "path";
import fs from "fs";
import ast from "abstract-syntax-tree";

const depsArray = [];

const depsGraph = (file) => {
  const fullPath = path.resolve("./src/", file);

  // return early if exists
  if (!!depsArray.find((item) => item.name === fullPath)) return;

  // store path + parsed source as module
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const source = ast.parse(fileContents);
  const module = {
    name: fullPath,
    source,
  };

  // Add module to deps array
  depsArray.push(module);

  // process deps
  source.body.map((current) => {
    if (current.type === "ImportDeclaration") {
      // process module for each dep.
      depsGraph(current.source.value);
    }
  });

  return depsArray;
};

export { depsGraph };
