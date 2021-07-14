// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

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
