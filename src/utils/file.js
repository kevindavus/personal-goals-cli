// @flow

const path = require("path");
const { checkConf, confDir } = require("../commands/config");

module.exports = {
  getFileName(type: string, goal?: string = ""): string {
    const dir = path.join(confDir, type);
    if (goal.length > 0) {
      return path.join(
        dir,
        goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md"
      );
    }
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
