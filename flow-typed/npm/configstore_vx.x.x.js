// flow-typed signature: 602756263aead7f46a863f636d59ed98
// flow-typed version: <<STUB>>/configstore_v3.1.1/flow_v0.55.0

/**
 * Flowtype definitions for index
 * Generated by Flowgen from a Typescript Definition
 * Flowgen v1.2.0
 * Author: [Joar Wilk](http://twitter.com/joarwilk)
 * Repo: http://github.com/joarwilk/flowgen
 */

type configStore$PGCalias = {
  y: string,
  year: string,
  m: string,
  month: string,
  w: string,
  week: string,
  o: string
};
type configStore$PGCfocus = {
  weekly: string
};
type configStore$PGCtypes = Array<string>;
type configStore$PGCtitles = {
  yearly: string,
  monthly: string,
  weekly: string,
  other: string,
  today: string,
  tomorrow: string
};

type configStore$PGCconf = {
  alias: PGCalias,
  focus: PGCfocus,
  types: PGCtypes,
  titles: PGCtitles,
  dir: string,
  readme: string
};

declare class configstore$Configstore {
  constructor(
    packageName: string,
    defaults?: any,
    options?: Configstore$ConfigstoreOptions
  ): this,

  /**
   * Get the path to the config file. Can be used to show the user
   * where it is, or better, open it for them.
   */
  path: string,

  /**
   * Get all items as an object or replace the current config with an object.
   */
  all: any,

  /**
   * Get the item count
   */
  size: number,

  /**
   * Get an item
   * @param key The string key to get
   * @return  The contents of the config from key $key
   */
  get(key: string): any,

  /**
   * Set an item
   * @param key The string key
   * @param val The value to set
   */
  set(key: string, val: any): void,

  /**
   * Set all key/value pairs declared in $values
   * @param values The values object.
   */
  set(values: any): void,

  /**
   * Determines if a key is present in the config
   * @param key The string key to test for
   * @return  True if the key is present
   */
  has(key: string): boolean,

  /**
   * Delete an item.
   * @param key The key to delete
   */
  delete(key: string): void,

  /**
   * Clear the config.
   * Equivalent to <code>Configstore.all = {};</code>
   */
  clear(): void
}
declare interface Configstore$ConfigstoreOptions {
  globalConfigPath?: boolean
}
declare module "configstore" {
  declare module.exports: Class<configstore$Configstore>;
}
