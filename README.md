# @foxglove/wasm-bz2

[![npm version](https://img.shields.io/npm/v/@foxglove/wasm-bz2)](https://www.npmjs.com/package/@foxglove/wasm-bz2)

Bzip2 decompression compiled to WebAssembly

## Introduction

This package provides a WebAssembly build of https://gitlab.com/federicomenaquintero/bzip2, the official Bzip2 library. Currently only a decompression function is provided.

## Usage

```ts
import Bzip2 from "@foxglove/wasm-bz2";

const bzip2 = await Bzip2.init();

try {
  const buffer = new Uint8Array([...]);
  const maxSize = 100;
  const decompressedBuffer = Bzip2.decompress(buffer, maxSize, { small: false });
} catch (error) {
  console.error(error);
}
```
