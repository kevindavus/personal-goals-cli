// @flow

const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const chalk = require("chalk");
const recursive = require("recursive-readdir");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");

module.exports = {
  command: "delete [type] [goal]",
  aliases: ["d", "del"],
  desc: "delete a goal",
  example: "$0 d w ",
  builder: (yargs: { default: (string, string) => mixed }) =>
    yargs.default("type", "w"),
  handler: (argv: { type: string, goal: string }) => {
    checkConf();

    let type: string;
    if (confTypes.includes(argv.type)) {
      type = argv.type;
    } else if (confAliases.hasOwnProperty(argv.type)) {
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

function deleteGoal(type: string, goal: string) {
  if (goal.indexOf("✔") >= 0) {
    goal = goal.substr("✔ ".length + 1);
    type = path.join("completed", type);
    findCompletedFile(type, goal);
  } else {
    fs.remove(getFileName(type, goal));
  }
  ls("all");
}

async function menu(type) {
  checkConf();
  const dir = getFileName(type, "");
  const completedDir = getFileName(path.join("completed", type));
  const files = await fs.readdir(dir);
  const completedFiles = await recursive(completedDir);
  const isEmpty = files.length === 0 && completedFiles.length === 0;
  const menu = new Menu({ bg: "black", fg: "white", width: 100 });

  menu.reset();
  menu.write("Which " + prettyName(type) + " Goal would you like to delete?\n");
  menu.write("-------------------------------------\n");
  try {
    if (!isEmpty) {
      files.forEach(item => menu.add(prettyName(item)));

      completedFiles.forEach(item => menu.add("✔︎ " + prettyName(item)));

      menu.add("None");

      menu.on("select", label => {
        menu.close();
        if (label === "None") {
          return;
        }
        deleteGoal(type, label);
      });
      process.stdin.pipe(menu.createStream()).pipe(process.stdout);
  
      process.stdin.setRawMode(true);
      menu.on("close", () => {
        process.stdin.setRawMode(false);
        process.stdin.end();
      });
    } else {
      console.log(
        chalk.bold(chalk.red("Error: ")) + " there are no goals of type " + type
      );
    }
  } catch (err) {
    console.error(err);
  }
}

function findCompletedFile(type, goal) {
  const dir = path.join(confDir, type);
  return fs.ensureDir(dir).then(() => {
    return fs.readdir(dir).then(files => {
      if (files.length === 0) {
        fs.remove(dir).then(() => Promise.reject());
      }
      files.map(item => {
        return fs.stat(path.join(dir, item)).then(stats => {
          if (stats.isDirectory()) {
            return findCompletedFile(path.join(type, item), goal);
          } else if (stats.isFile()) {
            if (prettyName(item) === prettyName(goal)) {
              return fs.remove(dir);
            }
          }
        });
      });
    });
  });
}
