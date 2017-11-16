let ls = (() => {
  var _ref = _asyncToGenerator(function* (type) {
    let res = "";
    //check if user passed in an alias to a type
    if (type && typeof confAliases.type === "string") {
      type = confAliases[type];
    } else {
      switch (type) {
        case "a":
          type = "all";
          break;
        case "complete":
        case "c":
          type = "completed";
          break;
        default:
          break;
      }
    }

    const types = confTypes;
    if (type === "all") {
      console.log("\r\n");
      //list all known types
      types.map((() => {
        var _ref2 = _asyncToGenerator(function* (thisType) {
          yield ls(thisType);
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })());
    } else {
      //list specified type
      const title = prettyName(type) + " Tasks";

      if (type.indexOf("completed") === -1) {
        //if user didn't already specify a completed type, also include the included goals of that type
        console.log(chalk.bold.underline(title) + "\n" + (yield print(type)) + "\n" + (yield print(path.join("completed", type))));
      } else {
        console.log("\n" + chalk.bold.underline(title) + "\n" + (yield print(type)));
      }
      return;
    }
  });

  return function ls(_x) {
    return _ref.apply(this, arguments);
  };
})();

let print = (() => {
  var _ref3 = _asyncToGenerator(function* (type, opts = {}) {
    const dir = getFileName(type);
    if (yield fs.pathExists(dir)) {
      try {
        const accomplishments = getFileName("accomplishments");
        let res = "";
        const files = yield fs.readdir(dir);
        try {
          if (files.length === 0) {
            fs.remove(dir);
            return "";
          }
          const goals = yield files.map((() => {
            var _ref4 = _asyncToGenerator(function* (item) {
              const stats = yield fs.stat(path.join(dir, item));
              try {
                if (stats.isDirectory()) {
                  if (item.match(/\w{3}\d{9,10}/g)) {
                    opts.date = item;
                  } else if (!item.startsWith(".")) {
                    return (yield chalk.underline(item)) + "\n";
                  }
                  return yield print(path.join(type, item), opts);
                } else if (stats.isFile()) {
                  if (typeof opts.date === "string") {
                    return yield isCurrent(type, opts.date, dir, item, accomplishments);
                  } else if (!item.startsWith(".")) {
                    return (yield prettyName(item)) + "\n";
                  }
                }
              } catch (err) {
                console.log(err);
                return "";
              }
            });

            return function (_x4) {
              return _ref4.apply(this, arguments);
            };
          })());
          return Promise.all(goals).then(function (results) {
            return results.join("");
          });
        } catch (err) {
          console.log(err);
          return "";
        }
      } catch (err) {
        console.error(err);
      }
    }
    return "";
  });

  return function print(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let isCurrent = (() => {
  var _ref5 = _asyncToGenerator(function* (type, date = "", dir, item, accomplishments) {
    if (type.includes("/")) {
      type = type.split("/").slice(-2, -1)[0];
    }
    if (type === "weekly" && moment(date, "MMMDDYYYYHHmm").diff(moment(), "day") < -6) {
      fs.move(path.join(dir, item), path.join(accomplishments, type, moment().day(-6).format("MMMDDYYYY"), item));
      return "";
    } else if (type === "monthly" && moment(date, "MMMDDYYYYHHmm").get("month") < moment().get("month")) {
      fs.move(path.join(dir, item), path.join(accomplishments, type, moment().month(moment().get("m") - 1).format("MMMM-YYYY"), item));
      return "";
    } else if (type === "yearly" && moment(date, "MMMDDYYYYHHmm").get("year") < moment().get("year")) {
      fs.move(path.join(dir, item), path.join(accomplishments, type, moment().year(moment().get("y") - 1).format("YYYY"), item));
      return "";
    }
    if (!item.startsWith(".")) {
      return `${chalk.green(prettyName(item))} ${chalk.gray("- " + moment(date, "MMMDDYYYYHHmm").fromNow())}\n`;
    }
    return "";
  });

  return function isCurrent(_x5) {
    return _ref5.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require("path");
const moment = require("moment");
const chalk = require("chalk");
const fs = require("fs-extra");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases } = require("./config");
const { write } = require("../utils/markdown");

module.exports = {
  command: {
    command: "ls [type]",
    aliases: ["list"],
    usage: `$0 ls  <w, m, y, o, c, a>`,
    description: `list goals of a type`,
    builder: yargs => yargs.default("type", "a"),
    handler: argv => {
      let type;
      if (confTypes.includes(argv.type)) {
        type = argv.type;
      } else if (confAliases.hasOwnProperty(argv.type)) {
        type = confAliases[argv.type];
      } else {
        switch (argv.type) {
          case "a":
            type = "all";
            break;
          case "complete":
          case "c":
            type = "completed";
            break;
          default:
            type = argv.type;
            break;
        }
      }
      ls(type);
      write();
    }
  },
  ls
};
//# sourceMappingURL=ls.js.map
