import ast from "abstract-syntax-tree";
import path from "path";

const module_template_string = `
(function(module, _ourRequire) {
  "use strict";
  {{module_code}}
})
`;

const bootstrap_string = `
(function(modules) {
  // Bootstrap. Define runtime.
  installedModules = {}
  function _our_require_(moduleId) {
    // Module in cache?
    if (installedModules[moduleId]) {
       return installedModules[moduleId].exports
       // Return what's assigned in funct
    }

    // Get module
    module = {
       i: moduleId,
       exports: {},
       loaded: false // need this?
    }
    // Execute module function
    modules[moduleId].call({},
        module,  
        _our_require_
    );
    module.loaded = true; 

    // Return exports of module
    return module.exports;
  }

  // Expose modules object
  _our_require_.m = modules;

  // Load entry module n return exports
  return _our_require_(0); // get right id

})
/* Dep tree */
([
 {{all_modules}}
]); 
`;

// Replacing ESM import/export with our functions
// const program = 'const returnTime = _ourRequire("{ID}");';
// const program = "module.exports = someFunction;";
// console.log("PROGRAM:", ast.parse(program).body[0]);
const get_import = (item, allDeps) => {
  // get function we import
  const importFunctionName = item.specifiers[0].imported.name;
  // get files full path and find index in deps array.
  const fileImported = item.source.value;
  // TODO: locally doesnt add /src/ so needs it. relates to CWD.
  const fullFile = path.resolve(fileImported.replace("./", "./src/"));
  const itemId = allDeps.findIndex(item => item.name === fullFile);

  return {
    type: "VariableDeclaration",
    kind: "const",
    declarations: [
      {
        type: "VariableDeclarator",
        init: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "_ourRequire"
          },
          arguments: [
            {
              type: "Literal",
              value: itemId
            }
          ]
        },
        id: {
          type: "Identifier",
          name: importFunctionName
        }
      }
    ]
  };
};
const get_export = item => {
  // get export functions name
  const moduleName = item.specifiers[0].exported.name;
  return {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "module" },
        computed: false,
        property: { type: "Identifier", name: "exports" }
      },
      operator: "=",
      right: { type: "Identifier", name: moduleName }
    }
  };
};
// console.log("generate test:", ast.generate(our_export));

const transform = depsArray => {
  const modulesString = [];

  depsArray.map(dependency => {
    const updatedAst = dependency.source.body.map(item => {
      if (item.type === "ImportDeclaration") {
        // replace module import with ours
        item = get_import(item, depsArray);
      }
      if (item.type === "ExportNamedDeclaration") {
        // replaces function name with real exported function
        item = get_export(item);
      }
      return item;
    });
    dependency.source.body = updatedAst;

    // Turn AST back into string
    const updatedSource = ast.generate(dependency.source);
    // console.log("=========>" + dependency.name + "<======\n");
    // console.log(updatedSource);

    // Bind module source to module template
    const updatedTemplate = module_template_string.replace(
      "{{module_code}}",
      updatedSource
    );
    modulesString.push(updatedTemplate);
  });

  // Add all modules to bundle
  const vendorString = bootstrap_string.replace(
    "{{all_modules}}",
    modulesString.join(",")
  );

  return vendorString;
};
export { transform };

// regenrate AST
// console.log(ast.generate(source));
