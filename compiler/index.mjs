import fs from "fs";
import crypto from "crypto";
import { depsGraph } from "./deps_graph.mjs";
import { transform } from "./transform.mjs";

// 1. Traverse deps graph
const entry = "./fileA.mjs"; // move to config or cli
const depsArray = depsGraph(entry);

// 2. Transform to bundle
const vendorString = transform(depsArray);

// 3. Write to bundle + manifest
// create hash
const sum = crypto.createHash("md5");
sum.update(vendorString);
const hash = sum.digest("hex");
// write contents to bundle
fs.writeFileSync(`./build/bundle-${hash}.js`, vendorString, "utf8");
// write hash to manifest
fs.writeFileSync(
  "./build/manifest.json",
  `{"bundle": "bundle-${hash}.js"}`,
  "utf8"
);

console.log("FINISHED :)");
