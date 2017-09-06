const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const chalk = require("chalk");
const recRead = require ("recursive-readdir-sync")
const { conf, checkConf } = require("./config");
const { prettyName, getFileName } = require("./utils/file");
const { ls } = require("./ls");

module.exports = {
  command: "delete [type] [goal]",
  aliases: ["d", "del"],
  desc: "delete a goal",
  example: "$0 d w ",
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
      deleteGoal(type, argv.goal);
    } else {
      menu(type);
    }
  }
};

function deleteGoal(type, goal) {
  if (goal.indexOf("✔") >= 0) {
    goal = goal.substr("✔ ".length +1);
    type = path.join("completed",type)
    findCompletedFile(type,goal);
    console.log(ls("all"));
  } else{
    fs.removeSync(getFileName(type, goal));
  }
  console.log(ls("all"));
}

function menu(type) {
  checkConf();
  const dir = getFileName(type, "");
  const completedDir = getFileName("completed", type, "");
  if (fs.pathExistsSync(dir) || fs.pathExistsSync(completedDir)){
  const menu = new Menu({ bg: "black", fg: "white", width: 100}); 

  menu.reset();
  menu.write("Which " + prettyName(type) + " Goal would you like to delete?\n");
  menu.write("-------------------------------------\n");
  if (fs.pathExistsSync(dir)){
  const files = fs.readdirSync(dir);
  files.forEach(item => menu.add(prettyName(item)));
}

if (fs.pathExistsSync(completedDir)){
  const completed = recRead(getFileName(path.join("completed", type)));
  completed.forEach(item => menu.add("✔︎ " + prettyName(item)));
}
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
}
else {
  console.log(chalk.red.bold("Error: ") + " there are no goals of type " + type);
}
}


function findCompletedFile(type, goal) {
  const dir = path.join(conf.get("dir"), type);
  fs.ensureDirSync(dir);
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
    return;
  }
  files.forEach(item => {
    const stats = fs.statSync(path.join(dir, item));
    if (stats.isDirectory()) {
      findCompletedFile(path.join(type,item), goal);
    } else if (stats.isFile()) {
     if (prettyName(item) === prettyName(goal)){
       fs.removeSync(dir)
       
     }
    }
  });
}