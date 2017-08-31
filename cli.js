#!/usr/bin/env node
"use strict";

const fs = require("fs-extra");
const request = require("request");
const Menu = require("terminal-menu");
const moment = require("moment");
const Configstore = require("configstore");
const pkg = require("./package.json");
const path = require("path");

const conf = new Configstore(pkg.name, {
  dir: fs.realpathSync(__dirname),
  weeklyfocus: "Do good things this week",
  monthlyfocus: "Do good things this month",
  yearlyfocus: "Do good things this year"
});
const _ = require("lodash");
const chalk = require("chalk");

require("yargs")
  .command({
    command: "new [type] [goal]",
    aliases: ["n"],
    desc: "Set a new goal",
    example: "$0 n w 'work out 3 times'",
    builder: yargs => yargs.default("type", "w"),
    handler: argv => {
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
      }
      newGoal(type, argv.goal);
    }
  })
  .command({
    command: "complete [type] [goal]",
    aliases: ["c"],
    desc: "mark a goal as completed",
    example: "$0 c w ",
    builder: yargs => yargs.default("type", "w"),
    handler: argv => {
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
      }
      if (argv.goal) {
        completeGoal(type, argv.goal);
      } else {
        menu(type);
      }
    }
  })
  .command({
    command: "ls [type]",
    aliases: ["list"],
    usage: `$0 ls  <w, m, y, o, c, a>`,
    description: `list goals of a type`,
    builder: yargs => yargs.default("type", "a"),
    handler: argv => {
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
      }
      console.log(ls(type));
    }
  })
  .command({
    command: "clear [type]",
    aliases: ["clr"],
    usage: `$0 clear  <w, m, y, o, c, a>`,
    description: `clear goals of a type`,
    builder: yargs => yargs.default("type", "a"),
    handler: argv => {
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
      }
      clear(type);
    }
  })
  .command({
    command: "config <key> [value]",
    aliases: ["cfg"],
    usage: `$0 config <key> [value]`,
    describe: "Set up the personal goals configuration",
    handler: argv => {
      if (argv.value === "clear") {
        conf.delete(argv.key);
      } else if (argv.key === "clear") {
        conf.clear();
      } else if (argv.key === "ls" || argv.key === "get") {
        console.log(conf.all);
      } else {
        conf.set(argv.key, argv.value);
        console.log("Successfully updated");
        console.log(`${chalk.bold(argv.key)}: ${conf.get(argv.key)}`);
      }
    }
  })
  .group("weekly (w)", "Types")
  .group("monthly (m)", "Types")
  .group("other (o)", "Types")
  .group("completed (c)", "Types")
  .group("all (a)", "Types")
  .example("ls", "$0 ls")
  .example("ls", "$0 ls complete")
  .example("ls", "$0 list all")
  .example("new", `$0 new w 'work out 3 times' `)
  .example("new", `$0 n m 'lose 5 pounds'`)
  .example("complete", "$0 c other")
  .example("complete", `$0 complete week 'work out 3 times'`)
  .example("config", "$0 cfg dir '/user/me/projects/personal-goals'")
  .example("config", `$0 config weeklyfocus 'get outside more'`)
  .example(
    "complete",
    "$0 config monthlyfocus 'punch as many nazis as possible'"
  )
  .example("config", `$0 cfg yearlyfocus 'destroy all nazis'`)
  .example("clear", "$0 clear all")
  .example("clear", `$0 clear weekly`)
  .help().argv;

writeMD();

function newGoal(type, goal) {
  const date = moment().format("MMMDYYYYHHmm");
  const file = getFileName(type, goal);
  const completedfile = getFileName("completed/" + type + "/" + date, goal);
  fs.ensureDirSync(conf.get("dir") + "/" + type);
  fs.stat(completedfile, (err, cstat) => {
    if (err == null) {
      console.log("Moving goal from completed to " + type);
      fs.moveSync(completedfile, file);
      console.log(ls(type));
    } else if (err.code == "ENOENT") {
      fs.stat(file, (err, stat) => {
        if (err == null) {
          console.log("Goal already exists");
        } else if (err.code == "ENOENT") {
          // File does not exist
          fs.closeSync(fs.openSync(file, "w"));
          console.log(ls("all"));
        } else {
          console.log("Some other error: ", err.code);
        }
      });
    }
  });
  writeMD();
}

function completeGoal(type, goal) {
  const date = moment().format("MMMDYYYYHHmm");
  const dir = conf.get("dir") + "/completed/" + type + "/" + date;
  fs.ensureDirSync(dir);
  fs.ensureDirSync(path.join(conf.get("dir"), type));
  fs.moveSync(
    getFileName(type, goal),
    getFileName("completed/" + type + "/" + date, goal)
  );
  console.log(ls("all"));
  writeMD();
}

function getFileName(type, goal) {
  if (goal.length) {
    return (
      conf.get("dir") + "/" + type + "/" + goal.replace(/[ /.//]/g, "_") + ".md"
    );
  }

  return conf.get("dir") + "/" + type;
}

function prettyName(file) {
  let lastSlash = file.lastIndexOf("/") + 1;
  let fileExt = file.lastIndexOf(".");
  lastSlash = lastSlash === -1 ? 0 : lastSlash;
  fileExt = fileExt === -1 ? 20 : fileExt;
  const goal = file.substring(lastSlash, fileExt);
  const ret = goal.replace(/_/g, " ").replace(/(\w)(\w*)/g, (_, i, r) => {
    return i.toUpperCase() + (r != null ? r : "");
  });
  return ret;
}

function menu(type) {
  const dir = getFileName(type, "");
  fs.ensureDirSync(dir);
  const files = fs.readdirSync(dir);
  const menu = Menu({ bg: "black", fg: "white" });

  menu.reset();
  menu.write("Which " + prettyName(type) + " Goal Did You Complete?\n");
  menu.write("-------------------------------------\n");
  files.map(item => menu.add(prettyName(item)));
  menu.add("None");

  menu.on("select", label => {
    menu.close();
    if (label === "None") {
      process.exit(0);
    }
    completeGoal(type, label);
  });
  process.stdin.pipe(menu.createStream()).pipe(process.stdout);

  process.stdin.setRawMode(true);
  menu.on("close", () => {
    process.stdin.setRawMode(false);
    process.stdin.end();
  });
}

function clear(type) {
  if (type === "all") {
    fs.removeSync(path.join(conf.get("dir"), "weekly"));
    fs.removeSync(path.join(conf.get("dir"), "monthly"));
    fs.removeSync(path.join(conf.get("dir"), "yearly"));
    fs.removeSync(path.join(conf.get("dir"), "other"));
    fs.removeSync(path.join(conf.get("dir"), "completed"));
  } else {
    fs.removeSync(path.join(conf.get("dir"), type));
  }
}

function ls(type) {
  let res = "";
  if (type === "all") {
    res += ls("weekly");
    res += ls("monthly");
    res += ls("yearly");
    res += ls("other");
  } else {
    const dir = conf.get("dir") + "/" + type;
    fs.ensureDir(dir);
    const title = prettyName(type) + " Tasks";
    res += "\n" + chalk.bold.underline(title) + "\n";
    res += print(type);
    if (type !== "completed") {
      res += print("completed/" + type);
    }
  }
  return res;
}

function print(type, opts = {}) {
  const dir = conf.get("dir") + "/" + type;
  fs.ensureDirSync(dir);
  let res = "";
  const files = fs.readdirSync(dir);
  if (!files.length) {
    fs.removeSync(dir);
  }
  files.map(item => {
    const stats = fs.statSync(dir + "/" + item);
    if (stats.isDirectory()) {
      if (item.match(/\w{3}\d{9,10}/g)) {
        if (moment(item, "MMMDYYYYHHmm").diff(moment(), "day") < -7) {
          /*fs.moveSync(
            path.join(dir, item),
            path.join(
              conf.get("dir"),
              "past",
              path
                .dirname(type)
                .split(path.delimiter)
                .pop()
            )
          );*/
          console.log(path.dirname(dir));
        }
        opts.date = item;
      } else {
        res += "\n" + chalk.underline(item) + "\n";
      }
      res += print(type + "/" + item, opts);
    } else if (stats.isFile()) {
      if (!opts.hasOwnProperty("date")) {
        res += prettyName(item) + "\n";
      } else {
        res += `${chalk.green(prettyName(item))} ${chalk.gray(
          "- " + moment(opts.date, "MMMDYYYYHHmm").fromNow()
        )}\n`;
      }
    }
  });
  return res;
}

function writeMD() {
  fs.truncate(conf.get("dir") + "/README.md", 0, () => {
    fs.writeFile(conf.get("dir") + "/README.md", genMD(), err => {
      if (err) {
        return console.log("Error writing file: " + err);
      }
    });
  });
}

function genMD() {
  const date = moment().day(0);
  const res = `
Personal Goals
==============
Personal goals made open source for accessibility across computers I use, transparency, accountability, and versioning. Learn more about it [here](http://una.im/personal-goals-guide).

# Overarching Goals for ${date.format("YYYY")}:
### This year's focus: ${conf.get("yearlyfocus")}

  
${MDprint("yearly")}${MDprint("completed/yearly")}
  
# Weekly Goals ${date.format("MMM Do, YYYY")}:
### This week's focus: ${conf.get("weeklyfocus")}

${MDprint("weekly")}${MDprint("completed/weekly")}

# Monthly Goals ${date.format("MMMM YYYY")}:
### This month's focus: ${conf.get("monthlyfocus")}

${MDprint("monthly")}${MDprint("completed/monthly")}  

# Other Goals:

${MDprint("other")}${MDprint("completed/other")}`;
  return res;
}

function MDprint(type, opts = {}) {
  const dir = conf.get("dir") + "/" + type;
  fs.ensureDirSync(dir);
  let res = "";
  const path = getFileName(type, "");
  const files = fs.readdirSync(path);
  if (!files.length) {
    fs.removeSync(path);
  }
  files.map(item => {
    if (!item.startsWith(".")) {
      const stats = fs.statSync(path + "/" + item);
      if (stats.isDirectory()) {
        if (item.match(/\w{3}\d{5,6}/g)) {
          opts.date = item;
        } else {
          res += `\n***${item}***\n`;
        }
        res += MDprint(type + "/" + item, opts);
      } else if (stats.isFile()) {
        if (!opts.hasOwnProperty("date")) {
          res += `* [ ] ${prettyName(item)}\n`;
        } else {
          res += `* [x] ${prettyName(item)} _- ${moment(
            opts.date,
            "MMMDYYYYHHmm"
          ).format("MMMM Do YYYY")}_\n`;
        }
      }
    }
  });
  return res;
}
