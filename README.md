# Our own version of Webpack in <200 lines

Bundlers can be complicated, so to understand here's one in 200 lines.

- `/src` -> application code
- `/compiler` -> our compiler code

## To run

`npm run start` runs 3 commands:

1. `npm clean` deletes the build bundle + manifest inside `build`
2. `npm compile` runs our compiler which builds a bunde and manifest file
3. `npm run start:server` starts our basic express server which uses the bundle hash from manifest.

## Concepts

- IIFE
- Dependency graphs
- Recursive functions
- Defining our own import/export system
- ESM
- AST code parsing
- AST code generation
- Hashing
- Pass by ref

## How it works

### Basic architecture:

      Modules -> Compiler -> Assets

### How this compiler works (and most other bundlers):

1. Builds dependency graph from entry file - see `compiler/deps_graph.mjs`
2. Converts tree into a bundle, stores hash of contents - see `compiler/transform.mjs`.
3. Server file reads the resulting manifest for details of bundle hash and serves to browser - see `server.mjs`

#### Additional

- We use ESM so it handles cyclic dependencies better than CJS (it does this due to its compile-time statis analysis feature).
- For simplicity we don't include non-js assets (e.g. images/css) or separate bundles (e.g. app/vendors).

## Note about Webpack

This repo is designed to help understand the basics, there are many other features WP includes which this does not:

- non-js assets
- Dev and HMR
- Code splitting/cherry picking/tree shaking
- Dynamic imports
- Making it extensible or configurable
- Loaders, plugins or lifecycle
