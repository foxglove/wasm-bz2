import { TextDecoder } from "util";

import Bzip2 from ".";

describe("wasm-bz2", () => {
  it("decodes simple example and reports errors", async () => {
    const bzip2 = await Bzip2.init();
    const data = Buffer.from(
      "QlpoOTFBWSZTWX78x88AAAMZgEACEAAyRoiQIAAiCMmmxCAaAMxKhYKglaLuSKcKEg/fmPng",
      "base64"
    );
    expect(() => bzip2.decompress(data, 13)).toThrow(
      "BZ2 decompression failed: -8 (BZ_OUTBUFF_FULL)"
    );
    expect(new TextDecoder().decode(bzip2.decompress(data, 14))).toEqual(
      "hello wasm-bz2"
    );
    expect(new TextDecoder().decode(bzip2.decompress(data, 100))).toEqual(
      "hello wasm-bz2"
    );
  });
});
