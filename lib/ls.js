const path = require("path");
const moment = require("moment");
const chalk = require("chalk");
const fs = require("fs-extra");
const { conf, checkConf } = require("./config");
const { prettyName, getFileName } = require("./utils/file");
const { write } = require("./utils/markdown");

module.exports = {
  command: {
    command: "ls [type]",
    aliases: ["list"],
    usage: `$0 ls  <w, m, y, o, c, a>`,
    description: `list goals of a type`,
    builder: yargs => yargs.default("type", "a"),
    handler: argv => {
      checkConf();

      let type;
      if (conf.get("types").includes(argv.type)) {
        type = argv.type;
      } else if (typeof conf.get("alias")[argv.type] === "string") {
        type = conf.get("alias")[argv.type];
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
  ls
};

function ls(type) {
  let res = "";
  if (typeof conf.get("alias")[type] === "string") {
    type = conf.get("alias")[type];
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
  const types = conf.get("types");
  if (type === "all") {
    types.forEach(thisType => {
      res += ls(thisType);
    });
  } else {
    checkConf();
    const dir = path.join(conf.get("dir"), type);
    fs.ensureDir(dir);

    const title = prettyName(type) + " Tasks";
    res += "\n" + chalk.bold.underline(title) + "\n";
    res += print(type);
    if (type !== "completed") {
      res += print(path.join("completed", type));
    }
  }
  write();
  return res;
}

function print(type, opts = {}) {
  const dir = path.join(conf.get("dir"), type);
  fs.ensureDirSync(dir);
  const accomplishments = path.join(conf.get("dir"), "accomplishments");
  fs.ensureDirSync(accomplishments);
  let res = "";
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
    return "";
  }
  files.forEach(item => {
    const stats = fs.statSync(path.join(dir, item));
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
        if (
          type === "weekly" &&
          moment(opts.date, "MMMDDYYYYHHmm").diff(moment(), "day") < -6
        ) {
          fs.moveSync(
            path.join(dir, item),
            path.join(
              accomplishments,
              type,
              moment()
                .day(-6)
                .format("MMMDDYYYY"),
              item
            )
          );
        } else if (
          type === "monthly" &&
          moment(opts.date, "MMMDDYYYYHHmm").get("month") <
            moment().get("month")
        ) {
          fs.moveSync(
            path.join(
              accomplishments,
              type,
              moment()
                .month(moment().get("m") - 1)
                .format("MMMM-YYYY"),
              item
            )
          );
        } else if (
          type === "yearly" &&
          moment(opts.date, "MMMDDYYYYHHmm").get("year") < moment().get("year")
        ) {
          fs.moveSync(
            path.join(
              accomplishments,
              type,
              moment()
                .year(moment().get("y") - 1)
                .format("YYYY"),
              item
            )
          );
        } else {
          res += `${chalk.green(prettyName(item))} ${chalk.gray(
            "- " + moment(opts.date, "MMMDDYYYYHHmm").fromNow()
          )}\n`;
        }
      } else if (!item.startsWith(".")) {
        res += prettyName(item) + "\n";
      }
    }
  });
  return res;
}
