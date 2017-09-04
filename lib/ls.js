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
      switch (argv.type) {
        case "weekly":
        case "week":
        case "w":
          type = "weekly";
          break;
        case "monthly":
        case "month":
        case "m":
          type = "monthly";
          break;
        case "yearly":
        case "year":
        case "y":
          type = "yearly";
          break;
        case "other":
        case "o":
          type = "other";
          break;
        case "all":
        case "a":
          type = "all";
          break;
        default:
          type = argv.type;
          break;
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
    types.forEach((thisType) => {
      res += ls(thisType)
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
  let res = "";
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
  }
  files.forEach(item => {
    const stats = fs.statSync(path.join(dir, item));
    if (stats.isDirectory()) {
      if (item.match(/\w{3}\d{9,10}/g)) {
        if (
          (path.basename(type) === "weekly" &&
            moment(item, "MMMDDYYYYHHmm").diff(moment(), "day") < -7) ||
          (path.basename(type) === "monthly" &&
            moment(item, "MMMDDYYYYHHmm").diff(moment(), "month") < 0) ||
          (path.basename(type) === "yearly" &&
            moment(item, "MMMDDYYYYHHmm").diff(moment(), "year") < 0)
        ) {
          fs.moveSync(
            path.join(dir, item),
            getFileName("past", path.basename(type), item)
          );
        }
        opts.date = item;
      } else {
        res += "\n" + chalk.underline(item) + "\n";
      }
      res += print(path.join(type, item), opts);
    } else if (stats.isFile()) {
      if (typeof opts.date === "string") {
        res += `${chalk.green(prettyName(item))} ${chalk.gray(
          "- " + moment(opts.date, "MMMDDYYYYHHmm").fromNow()
        )}\n`;
      } else if (!item.startsWith(".")) {
        res += prettyName(item) + "\n";
      }
    }
  });
  return res;
}
