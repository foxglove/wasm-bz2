// this file is injected into the module.js file _before_ most of the module definition
// which gives us the opportunity to override the module resolution behavior

/* eslint-disable */

Module.locateFile = function (input, prefix) {
  if (ENVIRONMENT_IS_NODE) {
    // In node, no special handling is needed
    return prefix + input;
  }
  if (input.endsWith(".wasm")) {
    // In a web context, the bundler (e.g. webpack) will see this require(), include the .wasm file
    // in its output, and replace this with a correct URL to the file.
    const wasmPath = require("./module.wasm");
    return wasmPath;
  }

  return input;
};
