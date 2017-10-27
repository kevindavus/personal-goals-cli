let menu = (() => {
  var _ref = _asyncToGenerator(function* (type) {
    checkConf();
    const dir = getFileName(type, "");
    yield fs.ensureDir(dir);
    const files = yield fs.readdir(dir);
    try {
      const menu = new Menu({ bg: "black", fg: "white", width: 100 });

      menu.reset();
      menu.write("Which " + prettyName(type) + " Goal Did You Complete?\n");
      menu.write("-------------------------------------\n");
      files.map(function (item) {
        if (!item.startsWith(".")) {
          menu.add(prettyName(item));
        }
      });
      menu.add("None");

      menu.on("select", function (label) {
        menu.close();
        if (label === "None") {
          return;
        }
        completeGoal(type, label);
      });
      process.stdin.pipe(menu.createStream()).pipe(process.stdout);

      process.stdin.setRawMode(true);
      menu.on("close", function () {
        process.stdin.setRawMode(false);
        process.stdin.end();
      });
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
const moment = require("moment");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
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
    if (confTypes.includes(argv.type)) {
      type = argv.type;
    } else if (confAliases.hasOwnProperty(argv.type)) {
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

function completeGoal(type, goal) {
  const date = moment().format("MMMDDYYYYHHmm");
  const dir = path.join(confDir, "completed", type, date);

  fs.move(getFileName(type, goal), getFileName(path.join("completed", type, date), goal)).then(() => ls("all"));
}
//# sourceMappingURL=complete.js.map
