"use strict";

var path = require("path");
var fs = require("fs-extra");

var _require = require("../commands/config"),
    checkConf = _require.checkConf,
    confDir = _require.confDir;

module.exports = {
  getFileName: function getFileName(type, goal) {
    var dir = path.join(confDir, type);
    checkConf();
    if (typeof goal === "string") {
      return path.join(dir, goal.replace(/[ ]/g, "_").replace(/[//]/g, "-") + ".md");
    }
    fs.ensureDirSync(dir);
    return dir;
  },
  prettyName: function prettyName(file) {
    var goal = path.basename(file, path.extname(file));
    var ret = goal.replace(/_/g, " ").replace(/(\w)(\w*)/g, function (_, i, r) {
      return i.toUpperCase() + (r === null ? "" : r);
    });
    return ret;
  }
};
//# sourceMappingURL=file.js.map
