// @flow

const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");
const { getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const {ls} = require("./ls")

module.exports = {
  command: "new [type] [goal]",
  aliases: ["n"],
  desc: "Set a new goal",
  example: "$0 n w 'work out 3 times'",
  handler: async (argv: { type: string, goal: string }) => {
    checkConf();

    let type: string;
    if (confTypes.includes(argv.type)) {
      type = argv.type;
    } else if (confAliases.hasOwnProperty(argv.type)) {
      type = confAliases[argv.type];
    } else {
      type = argv.type;
    }
    await newGoal(type, argv.goal);
    ls("all");
  }
};

async function newGoal(type, goal): Promise<void> {
  checkConf();
  const date = moment().format("MMMDDYYYYHHmm");
  const file = getFileName(type, goal);
  const filePath = getFileName(type);
  const completedFile = getFileName(path.join("completed", type, date), goal);
  fs.stat(completedFile, async function(err, stat) {
    if (err == null) {
      //file exists
      console.log("Moving goal from completed to " + type);
      fs.rename(file, completedFile);
    } else if (err.code == "ENOENT") {
      fs.stat(file, async function(err2, stat2) {
        if (err2 == null) {
          //file exists
          console.log("Goal already exists");
        } else if (err2.code == "ENOENT") {
          fs.ensureDirSync(filePath);
          //file does not exist
          fs.close(fs.openSync(file, "w"));
        }
      });
    }
  });
}
