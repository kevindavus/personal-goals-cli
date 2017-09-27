// @flow

const path = require("path");
const fs = require("fs-extra");
const { checkConf, confDir } = require("../commands/config");

module.exports = {
  getFileName(type: string, goal?: string): string {
    const dir = path.join(confDir, type);
    if (typeof goal === "string") {
      return path.join(
        dir,
        goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md"
      );
    }
    fs.ensureDirSync(dir);
    return dir;
  },

  prettyName(file: string): string {
    const goal = path.basename(file, path.extname(file));
    const ret = goal
      .replace(/_/g, " ")
      .replace(/(\w)(\w*)/g, (_, i: string, r: string) => {
        return i.toUpperCase() + (r === null ? "" : r);
      });
    return ret;
  }
};
