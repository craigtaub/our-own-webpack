import fs from "fs";
import { deps_graph } from "./deps_graph.mjs";
import { transform } from "./transform.mjs";

// 1. Travers deps graph
const entry = "./src/fileA.mjs";
const depsArray = deps_graph(entry, true);
// console.log(depsArray);

// 2. Transform to bundle
const vendorString = transform(depsArray);

// 3. Write to bundle + manifest
fs.writeFileSync("./build/bundle.js", vendorString, "utf8");
// TODO: manifest + use on server.

console.log("FINISHED :)");
