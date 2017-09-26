"use strict";

var path = require("path");
var fs = require("fs-extra");
var Menu = require("terminal-menu");
var chalk = require("chalk");
var recRead = require("recursive-readdir-sync");

var _require = require("../utils/file"),
    prettyName = _require.prettyName,
    getFileName = _require.getFileName;

var _require2 = require("./config"),
    checkConf = _require2.checkConf,
    confTypes = _require2.confTypes,
    confAliases = _require2.confAliases,
    confDir = _require2.confDir;

var _require3 = require("./ls"),
    ls = _require3.ls;

module.exports = {
  command: "delete [type] [goal]",
  aliases: ["d", "del"],
  desc: "delete a goal",
  example: "$0 d w ",
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
      deleteGoal(type, argv.goal);
    } else {
      menu(type);
    }
  }
};

function deleteGoal(type, goal) {
  if (goal.indexOf("✔") >= 0) {
    goal = goal.substr("✔ ".length + 1);
    type = path.join("completed", type);
    findCompletedFile(type, goal);
    console.log(ls("all"));
  } else {
    fs.removeSync(getFileName(type, goal));
  }
  console.log(ls("all"));
}

function menu(type) {
  checkConf();
  var dir = getFileName(type, "");
  var completedDir = getFileName(path.join("completed", type), "");
  if (fs.pathExistsSync(dir) || fs.pathExistsSync(completedDir)) {
    var _menu = new Menu({ bg: "black", fg: "white", width: 100 });

    _menu.reset();
    _menu.write("Which " + prettyName(type) + " Goal would you like to delete?\n");
    _menu.write("-------------------------------------\n");
    if (fs.pathExistsSync(dir)) {
      var files = fs.readdirSync(dir);
      files.forEach(function (item) {
        return _menu.add(prettyName(item));
      });
    }

    if (fs.pathExistsSync(completedDir)) {
      var completed = recRead(getFileName(path.join("completed", type)));
      completed.forEach(function (item) {
        return _menu.add("✔︎ " + prettyName(item));
      });
    }
    _menu.add("None");

    _menu.on("select", function (label) {
      _menu.close();
      if (label === "None") {
        return;
      }
      deleteGoal(type, label);
    });
    process.stdin.pipe(_menu.createStream()).pipe(process.stdout);
  } else {
    console.log(chalk.red.bold("Error: ") + " there are no goals of type " + type);
  }
}

function findCompletedFile(type, goal) {
  var dir = path.join(confDir, type);
  fs.ensureDirSync(dir);
  var files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
    return;
  }
  files.forEach(function (item) {
    var stats = fs.statSync(path.join(dir, item));
    if (stats.isDirectory()) {
      findCompletedFile(path.join(type, item), goal);
    } else if (stats.isFile()) {
      if (prettyName(item) === prettyName(goal)) {
        fs.removeSync(dir);
      }
    }
  });
}
//# sourceMappingURL=delete.js.map
