declare class path$Path {
  static basename: (path: string, ext?: string) => string,
  delimiter: string,
  dirname: (path: string) => string,
  static extname: (path: string) => string,
  format: (pathObject: {
    base?: string,
    dir?: string,
    ext?: string,
    name?: string,
    root?: string
  }) => string,
  isAbsolute: (path: string) => boolean,
  static join: (...parts: Array<string>) => string,
  normalize: (path: string) => string,
  parse: (
    pathString: string
  ) => { base: string, dir: string, ext: string, name: string, root: string },
  posix: any,
  relative: (from: string, to: string) => string,
  static resolve: (...parts: Array<string>) => string,
  sep: string,
  win32: any
}

declare module "path" {
  declare module.exports: Class<path$Path>;
}
