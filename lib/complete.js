const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const moment = require("moment");
const { conf, checkConf } = require("./config");
const { prettyName, getFileName } = require("./utils/file");
const { write } = require("./utils/markdown");
const { ls } = require("./ls");

module.exports = {
  command: "complete [type] [goal]",
  aliases: ["c"],
  desc: "mark a goal as completed",
  example: "$0 c w ",
  builder: yargs => yargs.default("type", "w"),
  handler: argv => {
    checkConf();

    let type;
    if (conf.get("types").includes(argv.type)) {
      type = argv.type;
    } else if (typeof conf.get("alias")[argv.type] === "string") {
      type = conf.get("alias")[argv.type];
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

function completeGoal(type, goal) {
  const date = moment().format("MMMDDYYYYHHmm");
  const dir = path.join(conf.get("dir"), "completed", type, date);
  fs.ensureDirSync(dir);
  fs.moveSync(
    getFileName(type, goal),
    getFileName(path.join("completed", type, date), goal)
  );
  console.log(ls("all"));
  write();
}

function menu(type) {
  checkConf();
  const dir = getFileName(type, "");
  fs.ensureDirSync(dir);
  const files = fs.readdirSync(dir);
  const menu = new Menu({ bg: "black", fg: "white", width: 100}); 

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

  process.stdin.setRawMode(true);
  menu.on("close", () => {
    process.stdin.setRawMode(false);
    process.stdin.end();
  });
}
