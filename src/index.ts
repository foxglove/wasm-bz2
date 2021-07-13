// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import ModuleFactory, { BZ2Module } from "../wasm/module";

let loaded = false;
let Module: BZ2Module;

const isLoaded = new Promise<void>((resolve, reject) => {
  ModuleFactory({
    onRuntimeInitialized: () => {
      loaded = true;
      resolve();
    },
  })
    .then((module) => (Module = module))
    .catch(reject);
});

export default {
  isLoaded,
  decompress(
    src: Uint8Array,
    destSize: number,
    { small = false } = {}
  ): Uint8Array {
    if (!loaded) {
      throw new Error(
        "wasm-bz2 module not initialized; await isLoaded before calling decompress"
      );
    }
    const srcBuf = Module._malloc(src.byteLength); // eslint-disable-line no-underscore-dangle
    const dstBuf = Module._malloc(destSize); // eslint-disable-line no-underscore-dangle
    Module.HEAPU8.subarray(srcBuf, srcBuf + src.byteLength).set(src);
    try {
      const { code, error, buffer } = Module.decompress(
        dstBuf,
        destSize,
        srcBuf,
        src.byteLength,
        small ? 1 : 0
      );
      if (code !== 0 || !buffer) {
        throw new Error(
          `BZ2 decompression failed: ${code} (${error ?? "unknown"})`
        );
      }
      return new Uint8Array(buffer); // copy out of emscripten heap before freeing
    } finally {
      Module._free(srcBuf); // eslint-disable-line no-underscore-dangle
      Module._free(dstBuf); // eslint-disable-line no-underscore-dangle
    }
  },
};
