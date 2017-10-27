// @flow

const path = require("path");
const moment = require("moment");
const chalk = require("chalk");
const fs = require("fs-extra");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases } = require("./config");

module.exports = {
  command: {
    command: "ls [type]",
    aliases: ["list"],
    usage: `$0 ls  <w, m, y, o, c, a>`,
    description: `list goals of a type`,
    builder: (yargs: { default: (type: string, value: string) => mixed }) =>
      yargs.default("type", "a"),
    handler: (argv: { type: string }) => {
      let type: string;
      if (confTypes.includes(argv.type)) {
        type = argv.type;
      } else if (confAliases.hasOwnProperty(argv.type)) {
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
      ls(type);
    }
  },
  ls
};

async function ls(type: string): Promise<void> {
  let res = "";
  //check if user passed in an alias to a type
  if (type && typeof confAliases.type === "string") {
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

  const types: Array<string> = confTypes;
  if (type === "all") {
    console.log("\r\n");
    //list all known types
    types.map(async thisType => {
      await ls(thisType);
    });
  } else {
    //list specified type
    const title = prettyName(type) + " Tasks";

    if (type.indexOf("completed") === -1) {
      //if user didn't already specify a completed type, also include the included goals of that type
      console.log(
        chalk.bold.underline(title) +
          "\n" +
          (await print(type)) +
          "\n" +
          (await print(path.join("completed", type)))
      );
    } else {
      console.log(
        "\n" + chalk.bold.underline(title) + "\n" + (await print(type))
      );
    }
    return;
  }
}

async function print(
  type: string,
  opts?: { date?: string } = {}
): Promise<string> {
  const dir = getFileName(type);
  if (await fs.pathExists(dir)) {
    try {
      const accomplishments = getFileName("accomplishments");
      let res = "";
      const files = await fs.readdir(dir);
      try {
        if (files.length === 0) {
          fs.remove(dir);
          return "";
        }
        const goals = await files.map(async item => {
          const stats = await fs.stat(path.join(dir, item));
          try {
            if (stats.isDirectory()) {
              if (item.match(/\w{3}\d{9,10}/g)) {
                opts.date = item;
              } else if (!item.startsWith(".")) {
                return (await chalk.underline(item)) + "\n";
              }
              return await print(path.join(type, item), opts);
            } else if (stats.isFile()) {
              if (typeof opts.date === "string") {
                return await isCurrent(
                  type,
                  opts.date,
                  dir,
                  item,
                  accomplishments
                );
              } else if (!item.startsWith(".")) {
                return (await prettyName(item)) + "\n";
              }
            }
          } catch (err) {
            console.log(err);
            return "";
          }
        });
        return Promise.all(goals).then(results => results.join(""));
      } catch (err) {
        console.log(err);
        return "";
      }
    } catch (err) {
      console.error(err);
    }
  }
  return "";
}

async function isCurrent(
  type: string,
  date: string = "",
  dir: string,
  item: string,
  accomplishments: string
): Promise<string> {
  if (type.includes("/")) {
    type = type.split("/").slice(-2, -1)[0];
  }
  if (
    type === "weekly" &&
    moment(date, "MMMDDYYYYHHmm").diff(moment(), "day") < -6
  ) {
    fs.move(
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
    return "";
  } else if (
    type === "monthly" &&
    moment(date, "MMMDDYYYYHHmm").get("month") < moment().get("month")
  ) {
    fs.move(
      path.join(dir, item),
      path.join(
        accomplishments,
        type,
        moment()
          .month(moment().get("m") - 1)
          .format("MMMM-YYYY"),
        item
      )
    );
    return "";
  } else if (
    type === "yearly" &&
    moment(date, "MMMDDYYYYHHmm").get("year") < moment().get("year")
  ) {
    fs.move(
      path.join(dir, item),
      path.join(
        accomplishments,
        type,
        moment()
          .year(moment().get("y") - 1)
          .format("YYYY"),
        item
      )
    );
    return "";
  }
  if (!item.startsWith(".")) {
    return `${chalk.green(prettyName(item))} ${chalk.gray(
      "- " + moment(date, "MMMDDYYYYHHmm").fromNow()
    )}\n`;
  }
  return "";
}
