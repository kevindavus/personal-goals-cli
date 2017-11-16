let menu = (() => {
  var _ref = _asyncToGenerator(function* (type) {
    checkConf();
    const dir = getFileName(type, "");
    const completedDir = getFileName(path.join("completed", type));
    yield fs.ensureDir(completedDir);
    yield fs.ensureDir(dir);
    const files = yield fs.readdir(dir);
    const completedFiles = yield recursive(completedDir);
    const dirIsEmpty = files.length === 0;
    const completedDirIsEmpty = completedFiles.length === 0;
    const isEmpty = dirIsEmpty && completedDirIsEmpty;
    const menu = new Menu({ bg: "black", fg: "white", width: 100 });

    menu.reset();
    menu.write("Which " + prettyName(type) + " Goal would you like to delete?\n");
    menu.write("-------------------------------------\n");
    try {
      if (!isEmpty) {
        if (!dirIsEmpty) {
          files.forEach(function (item) {
            return menu.add(prettyName(item));
          });
        }
        if (!completedDirIsEmpty) {
          completedFiles.forEach(function (item) {
            return menu.add("✔︎ " + prettyName(item));
          });
        }
        menu.add("None");

        menu.on("select", function (label) {
          menu.close();
          if (label === "None") {
            return;
          }
          deleteGoal(type, label);
        });
        process.stdin.pipe(menu.createStream()).pipe(process.stdout);

        process.stdin.setRawMode(true);
        menu.on("close", function () {
          process.stdin.setRawMode(false);
          process.stdin.end();
        });
      } else {
        console.log(chalk.bold(chalk.red("Error: ")) + " there are no goals of type " + type);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return function menu(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const chalk = require("chalk");
const recursive = require("recursive-readdir");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");
const { write } = require("../utils/markdown");

module.exports = {
  command: "delete [type] [goal]",
  aliases: ["d", "del"],
  desc: "delete a goal",
  example: "$0 d w ",
  builder: yargs => yargs.default("type", "w"),
  handler: argv => {
    checkConf();

    let type;
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

function deleteGoal(type, goal) {
  if (goal.indexOf("✔") >= 0) {
    goal = goal.substr("✔ ".length + 1);
    type = path.join("completed", type);
    findCompletedFile(type, goal);
  } else {
    fs.remove(getFileName(type, goal)).then(() => {
      ls("all");
      write();
    });
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
              return fs.remove(dir).then(() => {
                ls("all");
                write();
              });
            }
          }
        });
      });
    });
  });
}
//# sourceMappingURL=delete.js.map
