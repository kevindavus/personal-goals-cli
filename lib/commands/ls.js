"use strict";

var path = require("path");
var moment = require("moment");
var chalk = require("chalk");
var fs = require("fs-extra");

var _require = require("../utils/file"),
    prettyName = _require.prettyName,
    getFileName = _require.getFileName;

var _require2 = require("../utils/markdown"),
    write = _require2.write;

var _require3 = require("./config"),
    checkConf = _require3.checkConf,
    confTypes = _require3.confTypes,
    confAliases = _require3.confAliases;

module.exports = {
  command: {
    command: "ls [type]",
    aliases: ["list"],
    usage: "$0 ls  <w, m, y, o, c, a>",
    description: "list goals of a type",
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
      console.log(ls(type));
    }
  },
  ls: ls
};

function ls(type) {
  var res = "";
  if (typeof confAliases[type] === "string") {
    type = confAliases[type];
  } else {
    switch (type) {
      case "a":
        type = "all";
        break;
      case "complete":
      case "c":
        type = "completed";
        break;
      default:
        break;
    }
  }
  var types = confTypes;
  if (type === "all") {
    types.forEach(function (thisType) {
      res += ls(thisType);
    });
  } else {
    checkConf();
    var title = prettyName(type) + " Tasks";
    res += "\n" + chalk.bold.underline(title) + "\n";
    res += print(type);
    if (type !== "completed") {
      res += print(path.join("completed", type));
    }
  }
  write();
  return res;
}

function print(type) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var dir = getFileName(type);
  var accomplishments = getFileName("accomplishments");
  var res = "";
  var files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
    return "";
  }
  files.forEach(function (item) {
    var stats = fs.statSync(path.join(dir, item));
    if (stats.isDirectory()) {
      if (item.match(/\w{3}\d{9,10}/g)) {
        opts.date = item;
      } else {
        res += "\n" + chalk.underline(item) + "\n";
      }
      res += print(path.join(type, item), opts);
    } else if (stats.isFile()) {
      if (typeof opts.date === "string") {
        type = type.split("/").slice(-2, -1)[0];
        if (type === "weekly" && moment(opts.date, "MMMDDYYYYHHmm").diff(moment(), "day") < -6) {
          fs.moveSync(path.join(dir, item), path.join(accomplishments, type, moment().day(-6).format("MMMDDYYYY"), item));
        } else if (type === "monthly" && moment(opts.date, "MMMDDYYYYHHmm").get("month") < moment().get("month")) {
          fs.moveSync(path.join(accomplishments, type, moment().month(moment().get("m") - 1).format("MMMM-YYYY"), item));
        } else if (type === "yearly" && moment(opts.date, "MMMDDYYYYHHmm").get("year") < moment().get("year")) {
          fs.moveSync(path.join(accomplishments, type, moment().year(moment().get("y") - 1).format("YYYY"), item));
        } else {
          res += chalk.green(prettyName(item)) + " " + chalk.gray("- " + moment(opts.date, "MMMDDYYYYHHmm").fromNow()) + "\n";
        }
      } else if (!item.startsWith(".")) {
        res += prettyName(item) + "\n";
      }
    }
  });
  return res;
}
//# sourceMappingURL=ls.js.map
