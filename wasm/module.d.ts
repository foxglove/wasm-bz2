export type BZ2Module = EmscriptenModule & {
  decompress: (
    destPtr: number,
    dstSize: number,
    srcPtr: number,
    srcSize: number,
    small: number
  ) => { code: number; error?: string; buffer?: Uint8Array };
};

const ModuleFactory: EmscriptenModuleFactory<BZ2Module>;
export default ModuleFactory;
