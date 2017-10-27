// flow-typed signature: 2619300a4a83aef73b34079a3101b1d7
// flow-typed version: <<STUB>>/fs-extra_v^4.0.1/flow_v0.55.0

declare class fs$fs {
  static copy(src: string, dest: string, options?: CopyOptions): Promise<void>,
  static copy(
    src: string,
    dest: string,
    callback: (err: Error | null) => void
  ): void,
  static copy(
    src: string,
    dest: string,
    options: CopyOptions,
    callback: (err: Error | null) => void
  ): void,
  static copySync(src: string, dest: string, options?: CopyOptions): void,

  static move(src: string, dest: string, options?: MoveOptions): Promise<void>,
  static move(
    src: string,
    dest: string,
    callback: (err: Error | null) => void
  ): void,
  static move(
    src: string,
    dest: string,
    options: MoveOptions,
    callback: (err: Error | null) => void
  ): void,
  static moveSync(src: string, dest: string, options?: MoveOptions): void,

  static createFile(file: string): Promise<void>,
  static createFile(file: string, callback: (err: Error | null) => void): void,
  static createFileSync(file: string): void,

  static ensureDir(path: string): Promise<void>,
  static ensureDir(path: string, callback: (err: Error | null) => void): void,
  static ensureDirSync(path: string): void,

  static mkdirs(dir: string): Promise<void>,
  static mkdirs(dir: string, callback: (err: Error | null) => void): void,
  static mkdirp(dir: string): Promise<void>,
  static mkdirp(dir: string, callback: (err: Error | null) => void): void,
  static mkdirsSync(dir: string): void,
  static mkdirpSync(dir: string): void,

  static outputFile(file: string, data: any): Promise<void>,
  static outputFile(
    file: string,
    data: any,
    callback: (err: Error | null) => void
  ): void,
  static outputFileSync(file: string, data: any): void,

  static readJson(file: string, options?: ReadOptions): Promise<any>,
  static readJson(
    file: string,
    callback: (err: Error | null, jsonObject: any) => void
  ): void,
  static readJson(
    file: string,
    options: ReadOptions,
    callback: (err: Error | null, jsonObject: any) => void
  ): void,
  static readJSON(file: string, options?: ReadOptions): Promise<any>,
  static readJSON(
    file: string,
    callback: (err: Error | null, jsonObject: any) => void
  ): void,
  static readJSON(
    file: string,
    options: ReadOptions,
    callback: (err: Error | null, jsonObject: any) => void
  ): void,

  static readJsonSync(file: string, options?: ReadOptions): any,
  static readJSONSync(file: string, options?: ReadOptions): any,

  static remove(dir: string): Promise<void>,
  static remove(dir: string, callback: (err: Error | null) => void): void,
  static removeSync(dir: string): void,

  static outputJSON(
    file: string,
    data: any,
    options?: WriteOptions
  ): Promise<void>,
  static outputJSON(
    file: string,
    data: any,
    options: WriteOptions,
    callback: (err: Error | null) => void
  ): void,
  static outputJSON(
    file: string,
    data: any,
    callback: (err: Error | null) => void
  ): void,
  static outputJson(
    file: string,
    data: any,
    options?: WriteOptions
  ): Promise<void>,
  static outputJson(
    file: string,
    data: any,
    options: WriteOptions,
    callback: (err: Error | null) => void
  ): void,
  static outputJson(
    file: string,
    data: any,
    callback: (err: Error | null) => void
  ): void,
  static outputJsonSync(file: string, data: any, options?: WriteOptions): void,
  static outputJSONSync(file: string, data: any, options?: WriteOptions): void,

  static writeJSON(
    file: string,
    object: any,
    options?: WriteOptions
  ): Promise<void>,
  static writeJSON(
    file: string,
    object: any,
    callback: (err: Error | null) => void
  ): void,
  static writeJSON(
    file: string,
    object: any,
    options: WriteOptions,
    callback: (err: Error | null) => void
  ): void,
  static writeJson(
    file: string,
    object: any,
    options?: WriteOptions
  ): Promise<void>,
  static writeJson(
    file: string,
    object: any,
    callback: (err: Error | null) => void
  ): void,
  static writeJson(
    file: string,
    object: any,
    options: WriteOptions,
    callback: (err: Error | null) => void
  ): void,

  static writeJsonSync(file: string, object: any, options?: WriteOptions): void,
  static writeJSONSync(file: string, object: any, options?: WriteOptions): void,

  static ensureFile(path: string): Promise<void>,
  static ensureFile(path: string, callback: (err: Error | null) => void): void,
  static ensureFileSync(path: string): void,

  static ensureLink(src: string, dest: string): Promise<void>,
  static ensureLink(
    src: string,
    dest: string,
    callback: (err: Error | null) => void
  ): void,
  static ensureLinkSync(src: string, dest: string): void,

  static ensureSymlink(
    src: string,
    dest: string,
    type?: SymlinkType
  ): Promise<void>,
  static ensureSymlink(
    src: string,
    dest: string,
    type: SymlinkType,
    callback: (err: Error | null) => void
  ): void,
  static ensureSymlink(
    src: string,
    dest: string,
    callback: (err: Error | null) => void
  ): void,
  static ensureSymlinkSync(src: string, dest: string, type?: SymlinkType): void,

  static emptyDir(path: string): Promise<void>,
  static emptyDir(path: string, callback: (err: Error | null) => void): void,
  static emptyDirSync(path: string): void,

  static existsSync(path: string): boolean,
  static pathExists(path: string): Promise<boolean>,
  static pathExists(
    path: string,
    callback: (err: Error | null, exists: boolean) => void
  ): void,
  static pathExistsSync(path: string): boolean,

  static access(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,
  static access(
    path: string | Buffer,
    mode: number,
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,
  static access(path: string | Buffer, mode?: number): Promise<void>,

  static appendFile(
    file: string | Buffer | number,
    data: any,
    options: { encoding?: string, mode?: number | string, flag?: string },
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,
  static appendFile(
    file: string | Buffer | number,
    data: any,
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,
  static appendFile(
    file: string | Buffer | number,
    data: any,
    options?: { encoding?: string, mode?: number | string, flag?: string }
  ): Promise<void>,

  static chmod(
    path: string | Buffer,
    mode: string | number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static chmod(path: string | Buffer, mode: string | number): Promise<void>,

  static chown(path: string | Buffer, uid: number, gid: number): Promise<void>,
  static chown(
    path: string | Buffer,
    uid: number,
    gid: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,

  static close(
    fd: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static close(fd: number): Promise<void>,
  static closeSync(fd: number): void,

  static fchmod(
    fd: number,
    mode: string | number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static fchmod(fd: number, mode: string | number): Promise<void>,

  static fchown(
    fd: number,
    uid: number,
    gid: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static fchown(fd: number, uid: number, gid: number): Promise<void>,

  static fdatasync(fd: number, callback: () => void): void,
  static fdatasync(fd: number): Promise<void>,

  static fstat(
    fd: number,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => any
  ): void,
  static fstat(fd: number): Promise<Stats>,

  static fsync(
    fd: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static fsync(fd: number): Promise<void>,

  static ftruncate(
    fd: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static ftruncate(
    fd: number,
    len: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static ftruncate(fd: number, len?: number): Promise<void>,

  static futimes(
    fd: number,
    atime: number,
    mtime: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static futimes(
    fd: number,
    atime: Date,
    mtime: Date,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static futimes(fd: number, atime: number, mtime: number): Promise<void>,
  static futimes(fd: number, atime: Date, mtime: Date): Promise<void>,

  static lchown(
    path: string | Buffer,
    uid: number,
    gid: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static lchown(path: string | Buffer, uid: number, gid: number): Promise<void>,

  static link(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static link(
    srcpath: string | Buffer,
    dstpath: string | Buffer
  ): Promise<void>,

  static lstat(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => any
  ): void,
  static lstat(path: string | Buffer): Stats,

  static lstatSync(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => any
  ): void,
  static lstatSync(path: string | Buffer): Stats,

  static mkdir(
    path: string | Buffer,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,

  static mkdir(
    path: string | Buffer,
    mode: number | string,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static mkdir(path: string | Buffer): Promise<void>,

  static open(
    path: string | Buffer,
    flags: string | number,
    callback: (err: NodeJS.ErrnoException | null, fd: number) => void
  ): void,
  static open(
    path: string | Buffer,
    flags: string | number,
    mode: number,
    callback: (err: NodeJS.ErrnoException | null, fd: number) => void
  ): void,
  static open(
    path: string | Buffer,
    flags: string | number,
    mode?: number
  ): Promise<number>,

  static openSync(
    path: string | Buffer,
    flags: string | number,
    callback: (err: NodeJS.ErrnoException | null, fd: number) => void
  ): void,
  static openSync(
    path: string | Buffer,
    flags: string | number,
    mode: number,
    callback: (err: NodeJS.ErrnoException | null, fd: number) => void
  ): void,
  static openSync(
    path: string | Buffer,
    flags: string | number,
    mode?: number
  ): number,

  static read(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null,
    callback: (
      err: NodeJS.ErrnoException | null,
      bytesRead: number,
      buffer: Buffer
    ) => void
  ): void,
  static read(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null
  ): Promise<ReadResult>,

  static readFile(
    file: string | Buffer | number,
    callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void,
  static readFile(
    file: string | Buffer | number,
    encoding: string,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void
  ): void,
  static readFile(
    file: string | Buffer | number,
    options: { flag?: string } | { encoding: string, flag?: string },
    callback: (err: NodeJS.ErrnoException, data: Buffer) => void
  ): void,
  static readFile(
    file: string | Buffer | number,
    options: { flag?: string } | { encoding: string, flag?: string }
  ): Promise<string>,
  static readFile(
    file: string | Buffer | number,
    encoding: string
  ): Promise<string>,
  static readFile(file: string | Buffer | number): Promise<Buffer>,

  static readFileSync(
    file: string | Buffer | number,
    callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
  ): void,
  static readFileSync(
    file: string | Buffer | number,
    encoding: string,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void
  ): void,
  static readFileSync(
    file: string | Buffer | number,
    options: { flag?: string } | { encoding: string, flag?: string },
    callback: (err: NodeJS.ErrnoException, data: Buffer) => void
  ): void,
  static readFileSync(
    file: string | Buffer | number,
    options: { flag?: string } | { encoding: string, flag?: string }
  ): string,
  static readFileSync(file: string | Buffer | number, encoding: string): string,
  static readFileSync(file: string | Buffer | number): Buffer,

  static readdir(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, files: string[]) => void
  ): void,
  static readdir(path: string | Buffer): Promise<string[]>,
  static readdirSync(spath: string | Buffer): Array<string>,

  static readlink(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, linkString: string) => any
  ): void,
  static readlink(path: string | Buffer): Promise<string>,

  static realpath(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => any
  ): void,
  static realpath(
    path: string | Buffer,
    cache: { [path: string]: string },
    callback: (err: NodeJS.ErrnoException | null, resolvedPath: string) => any
  ): void,
  static realpath(
    path: string | Buffer,
    cache?: { [path: string]: string }
  ): Promise<string>,

  static rename(
    oldPath: string,
    newPath: string,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static rename(oldPath: string, newPath: string): Promise<void>,

  static rmdir(
    path: string | Buffer,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static rmdir(path: string | Buffer): Promise<void>,

  static stat(
    path: string | Buffer,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => any
  ): void,
  static stat(path: string | Buffer): Promise<Stats>,
  static statSync(
    path: string | Buffer
  ): { isDirectory: () => boolean, isFile: () => boolean },

  static symlink(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    type: string,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static symlink(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    type?: string
  ): Promise<void>,

  static truncate(
    path: string | Buffer,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static truncate(
    path: string | Buffer,
    len: number,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static truncate(path: string | Buffer, len?: number): Promise<void>,

  static unlink(
    path: string | Buffer,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static unlink(path: string | Buffer): Promise<void>,

  static utimes(
    path: string | Buffer,
    atime: number,
    mtime: number,
    callback: (err?: NodeJS.ErrnoException) => void
  ): void,
  static utimes(
    path: string | Buffer,
    atime: Date,
    mtime: Date,
    callback: (err?: NodeJS.ErrnoException | null) => void
  ): void,
  static utimes(
    path: string | Buffer,
    atime: number,
    mtime: number
  ): Promise<void>,
  static utimes(path: string | Buffer, atime: Date, mtime: Date): Promise<void>,

  static write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null,
    callback: (
      err: NodeJS.ErrnoException,
      written: number,
      buffer: Buffer
    ) => void
  ): void,
  static write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    callback: (
      err: NodeJS.ErrnoException | null,
      written: number,
      buffer: Buffer
    ) => void
  ): void,
  static write(
    fd: number,
    data: any,
    callback: (
      err: NodeJS.ErrnoException | null,
      written: number,
      str: string
    ) => void
  ): void,
  static write(
    fd: number,
    data: any,
    offset: number,
    callback: (
      err: NodeJS.ErrnoException | null,
      written: number,
      str: string
    ) => void
  ): void,
  static write(
    fd: number,
    data: any,
    offset: number,
    encoding: string,
    callback: (
      err: NodeJS.ErrnoException | null,
      written: number,
      str: string
    ) => void
  ): void,
  static write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position?: number | null
  ): Promise<WriteResult>,
  static write(
    fd: number,
    data: any,
    offset: number,
    encoding?: string
  ): Promise<WriteResult>,

  static writeFile(
    file: string | Buffer | number,
    data: any,
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,
  static writeFile(
    file: string | Buffer | number,
    data: any,
    options: { encoding?: string, mode?: number, flag?: string },
    callback: (err: NodeJS.ErrnoException | null) => void
  ): void,

  static mkdtemp(prefix: string): Promise<string>,
  static mkdtemp(
    prefix: string,
    callback: (err: NodeJS.ErrnoException | null, folder: string) => void
  ): void
}

declare module "fs-extra" {
  declare module.exports: Class<fs$fs>;
}

declare interface PathEntry {
  path: string,
  stats: Stats
}

declare interface PathEntryStream {
  read(): PathEntry | null
}

declare type CopyFilter = ((src: string, dest: string) => boolean) | RegExp;

declare type SymlinkType = "dir" | "file";

declare interface CopyOptions {
  dereference?: boolean,
  overwrite?: boolean,
  preserveTimestamps?: boolean,
  errorOnExist?: boolean,
  filter?: CopyFilter,
  recursive?: boolean
}

declare interface MoveOptions {
  overwrite?: boolean,
  limit?: number
}

declare interface ReadOptions {
  throws?: boolean,
  fs?: object,
  reviver?: any,
  encoding?: string,
  flag?: string
}

declare interface WriteOptions {
  fs?: object,
  replacer?: any,
  spaces?: number,
  encoding?: string,
  flag?: string,
  mode?: number
}

declare interface ReadResult {
  bytesRead: number,
  buffer: Buffer
}

declare interface WriteResult {
  bytesWritten: number,
  buffer: Buffer
}
