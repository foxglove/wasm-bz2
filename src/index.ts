import ModuleFactory, { BZ2Module } from "../wasm/module";

export default class Bzip2 {
  static async init(): Promise<Bzip2> {
    return new Bzip2(await ModuleFactory());
  }

  private constructor(private module: BZ2Module) {}

  decompress(
    src: Uint8Array,
    destSize: number,
    { small = false } = {}
  ): Uint8Array {
    const srcBuf = this.module._malloc(src.byteLength); // eslint-disable-line no-underscore-dangle
    const dstBuf = this.module._malloc(destSize); // eslint-disable-line no-underscore-dangle
    this.module.HEAPU8.subarray(srcBuf, srcBuf + src.byteLength).set(src);
    try {
      const { code, error, buffer } = this.module.decompress(
        dstBuf,
        destSize,
        srcBuf,
        src.byteLength,
        small ? 1 : 0
      );
      if (code !== 0 || buffer == undefined) {
        throw new Error(
          `BZ2 decompression failed: ${code} (${error ?? "unknown"})`
        );
      }
      return new Uint8Array(buffer); // copy out of emscripten heap before freeing
    } finally {
      this.module._free(srcBuf); // eslint-disable-line no-underscore-dangle
      this.module._free(dstBuf); // eslint-disable-line no-underscore-dangle
    }
  }
}
