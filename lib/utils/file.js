const path = require("path");
const { conf, checkConf } = require("../config");

module.exports = {
  getFileName(type, goal) {
    checkConf();
    if (goal) {
      return path.join(
        conf.get("dir"),
        type,
        goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md"
      );
    }

    return path.join(conf.get("dir"), type);
  },

  prettyName(file) {
    const goal = path.basename(file, path.extname(file));
    const ret = goal.replace(/_/g, " ").replace(/(\w)(\w*)/g, (_, i, r) => {
      return i.toUpperCase() + (r === null ? "" : r);
    });
    return ret;
  }
};
