"use strict";

var path = require("path");
var fs = require("fs-extra");
var Menu = require("terminal-menu");
var moment = require("moment");

var _require = require("../utils/file"),
    prettyName = _require.prettyName,
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
  command: "complete [type] [goal]",
  aliases: ["c"],
  desc: "mark a goal as completed",
  example: "$0 c w ",
  builder: function builder(yargs) {
    return yargs.default("type", "w");
  },
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
    if (argv.goal) {
      completeGoal(type, argv.goal);
    } else {
      menu(type);
    }
  }
};

function completeGoal(type, goal) {
  var date = moment().format("MMMDDYYYYHHmm");
  var dir = path.join(confDir, "completed", type, date);
  fs.ensureDirSync(dir);
  fs.moveSync(getFileName(type, goal), getFileName(path.join("completed", type, date), goal));
  console.log(ls("all"));
  write();
}

function menu(type) {
  checkConf();
  var dir = getFileName(type, "");
  fs.ensureDirSync(dir);
  var files = fs.readdirSync(dir);
  var menu = new Menu({ bg: "black", fg: "white", width: 100 });

  menu.reset();
  menu.write("Which " + prettyName(type) + " Goal Did You Complete?\n");
  menu.write("-------------------------------------\n");
  files.map(function (item) {
    return menu.add(prettyName(item));
  });
  menu.add("None");

  menu.on("select", function (label) {
    menu.close();
    if (label === "None") {
      return;
    }
    completeGoal(type, label);
  });
  process.stdin.pipe(menu.createStream()).pipe(process.stdout);
}
//# sourceMappingURL=complete.js.map
