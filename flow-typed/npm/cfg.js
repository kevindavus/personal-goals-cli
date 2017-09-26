// flow-typed signature: 602756263aead7f46a863f636d59ed98
// flow-typed version: <<STUB>>/igstore_v3.1.1/flow_v0.55.0

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

declare class configStore$ConfigStore {
  (name: string, PGCconf): configStore$ConfigStore,
  static get(
    key: string,
    value?: any
  ): PGCalias | PGCfocus | PGCtypes | PGCtitles | string,
  set(key: any, value?: any): void,
  all(): PGCconf,
  delete(key: string): void,
  clear(): void
}

declare module "configstore" {
  declare module.exports: Class<configstore$Configstore>;
}

declare module "Configstore" {
  declare module.exports: Class<configstore$Configstore>;
}
