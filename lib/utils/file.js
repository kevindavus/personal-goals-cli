const path = require("path");
const { checkConf, confDir } = require("../commands/config");

module.exports = {
  getFileName(type, goal = "") {
    const dir = path.join(confDir, type);
    if (goal.length > 0) {
      return path.join(dir, goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md");
    }
    return dir;
  },

  prettyName(file) {
    const goal = path.basename(file, path.extname(file));
    const ret = goal.replace(/_/g, " ").replace(/(\w)(\w*)/g, (_, i, r) => {
      return i.toUpperCase() + (r === null ? "" : r);
    });
    return ret;
  }
};
//# sourceMappingURL=file.js.map
