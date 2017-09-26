"use strict";

var path = require("path");
var fs = require("fs-extra");

var _require = require("./config"),
    checkConf = _require.checkConf,
    confTypes = _require.confTypes,
    confAliases = _require.confAliases,
    confDir = _require.confDir;

module.exports = {
  command: "clear [type]",
  aliases: ["clr"],
  usage: "$0 clear  <w, m, y, o, c, a>",
  description: "clear goals of a type",
  builder: function builder(yargs) {
    return yargs.default("type", "a");
  },
  handler: function handler(argv) {
    checkConf();

    var type = void 0;
    if (confTypes.includes(argv.type)) {
      type = argv.type;
    } else if (typeof confAliases[argv.type] === "string") {
      type = confAliases[argv.type];
    } else {
      switch (argv.type) {
        case "a":
          type = "all";
          break;
        case "complete":
        case "c":
          type = "completed";
          break;
        default:
          type = argv.type;
          break;
      }
    }
    clear(type);
  }
};

function clear(type) {
  if (type === "all") {
    fs.removeSync(path.join(confDir));
  } else {
    fs.removeSync(path.join(confDir, type));
  }
}
//# sourceMappingURL=clear.js.map
