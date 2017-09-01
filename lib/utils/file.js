const path = require("path");
const { conf, checkConf } = require("../config");
module.exports = {
  getFileName: function(type, goal) {
    checkConf();
    if (goal.length) {
      return path.join(
        conf.get("dir"),
        type,
        goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md"
      );
    }

    return path.join(conf.get("dir"), type);
  },

  prettyName: function(file) {
    const goal = path.basename(file, path.extname(file));
    const ret = goal.replace(/_/g, " ").replace(/(\w)(\w*)/g, (_, i, r) => {
      return i.toUpperCase() + (r != null ? r : "");
    });
    return ret;
  }
};
