// @flow

const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const moment = require("moment");
const { prettyName, getFileName } = require("../utils/file");
const { write } = require("../utils/markdown");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");

module.exports = {
  command: "complete [type] [goal]",
  aliases: ["c"],
  desc: "mark a goal as completed",
  example: "$0 c w ",
  builder: (yargs: { default: (string, string) => mixed }) =>
    yargs.default("type", "w"),
  handler: (argv: { type: string, goal: string }) => {
    checkConf();

    let type;
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

function completeGoal(type, goal): void {
  const date = moment().format("MMMDDYYYYHHmm");
  const dir = path.join(confDir, "completed", type, date);
  fs.ensureDirSync(dir);
  fs.moveSync(
    getFileName(type, goal),
    getFileName(path.join("completed", type, date), goal)
  );
  console.log(ls("all"));
  write();
}

function menu(type): void {
  checkConf();
  const dir = getFileName(type, "");
  fs.ensureDirSync(dir);
  const files = fs.readdirSync(dir);
  const menu = new Menu({ bg: "black", fg: "white", width: 100 });

  menu.reset();
  menu.write("Which " + prettyName(type) + " Goal Did You Complete?\n");
  menu.write("-------------------------------------\n");
  files.map(item => menu.add(prettyName(item)));
  menu.add("None");

  menu.on("select", label => {
    menu.close();
    if (label === "None") {
      return;
    }
    completeGoal(type, label);
  });
  process.stdin.pipe(menu.createStream()).pipe(process.stdout);
}
