const { conf, checkConf } = require("./config");
const moment = require("moment");
const { prettyName, getFileName } = require("./utils/file");
const fs = require("fs-extra");
const path = require("path");
const { write } = require("./utils/markdown");
const { ls } = require("./ls");

module.exports = {
  command: "new [type] [goal]",
  aliases: ["n"],
  desc: "Set a new goal",
  example: "$0 n w 'work out 3 times'",
  builder: yargs => yargs.default("type", "w"),
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
      default:
        type = argv.type;
        break;
    }
    newGoal(type, argv.goal);
  }
};

function newGoal(type, goal) {
  checkConf();
  const date = moment().format("MMMDDYYYYHHmm");
  const file = getFileName(type, goal);
  const completedfile = getFileName(path.join("completed", type, date), goal);
  fs.ensureDirSync(path.join(conf.get("dir"), type));
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
          fs.ensureFileSync(file);
          fs.closeSync(fs.openSync(file, "w"));
          console.log(ls("all"));
        } else {
          console.log("Some other error: ", err.code);
        }
      });
    }
  });
  write();
}
