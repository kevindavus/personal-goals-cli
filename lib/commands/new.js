"use strict";

var path = require("path");
var moment = require("moment");
var fs = require("fs-extra");

var _require = require("../utils/file"),
    getFileName = _require.getFileName;

var _require2 = require("../utils/markdown"),
    write = _require2.write;

var _require3 = require("./config"),
    checkConf = _require3.checkConf,
    confTypes = _require3.confTypes,
    confAliases = _require3.confAliases,
    confDir = _require3.confDir;

var _require4 = require("./ls"),
    ls = _require4.ls;

module.exports = {
  command: "new [type] [goal]",
  aliases: ["n"],
  desc: "Set a new goal",
  example: "$0 n w 'work out 3 times'",
  handler: function handler(argv) {
    checkConf();

    var type = void 0;
    if (confTypes.includes(argv.type)) {
      type = argv.type;
    } else if (typeof confAliases[argv.type] === "string") {
      type = confAliases[argv.type];
    } else {
      type = argv.type;
    }
    newGoal(type, argv.goal);
  }
};

function newGoal(type, goal) {
  checkConf();
  var date = moment().format("MMMDDYYYYHHmm");
  var file = getFileName(type, goal);
  var completedfile = getFileName(path.join("completed", type, date), goal);
  fs.ensureDirSync(path.join(confDir, type));
  if (fs.existsSync(completedfile)) {
    console.log("Moving goal from completed to " + type);
    fs.moveSync(completedfile, file);
    console.log(ls(type));
  } else if (fs.existsSync(file)) {
    console.log("Goal already exists");
  } else {
    // File does not exist
    fs.ensureFileSync(file);
    fs.closeSync(fs.openSync(file, "w"));
    console.log(ls("all"));
  }
  write();
}
//# sourceMappingURL=new.js.map
