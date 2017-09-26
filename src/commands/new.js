// @flow

const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");
const { getFileName } = require("../utils/file");
const { write } = require("../utils/markdown");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");

module.exports = {
  command: "new [type] [goal]",
  aliases: ["n"],
  desc: "Set a new goal",
  example: "$0 n w 'work out 3 times'",
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
    newGoal(type, argv.goal);
  }
};

function newGoal(type, goal): void {
  checkConf();
  const date = moment().format("MMMDDYYYYHHmm");
  const file = getFileName(type, goal);
  const completedfile = getFileName(path.join("completed", type, date), goal);
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
