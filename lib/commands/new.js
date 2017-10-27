let newGoal = (() => {
  var _ref2 = _asyncToGenerator(function* (type, goal) {
    checkConf();
    const date = moment().format("MMMDDYYYYHHmm");
    const file = getFileName(type, goal);
    const filePath = getFileName(type);
    const completedFile = getFileName(path.join("completed", type, date), goal);
    fs.stat(completedFile, (() => {
      var _ref3 = _asyncToGenerator(function* (err, stat) {
        if (err == null) {
          //file exists
          console.log("Moving goal from completed to " + type);
          fs.rename(file, completedFile);
        } else if (err.code == "ENOENT") {
          fs.stat(file, (() => {
            var _ref4 = _asyncToGenerator(function* (err2, stat2) {
              if (err2 == null) {
                //file exists
                console.log("Goal already exists");
              } else if (err2.code == "ENOENT") {
                fs.ensureDirSync(filePath);
                //file does not exist
                fs.close(fs.openSync(file, "w"));
              }
            });

            return function (_x6, _x7) {
              return _ref4.apply(this, arguments);
            };
          })());
        }
      });

      return function (_x4, _x5) {
        return _ref3.apply(this, arguments);
      };
    })());
  });

  return function newGoal(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");
const { getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");

module.exports = {
  command: "new [type] [goal]",
  aliases: ["n"],
  desc: "Set a new goal",
  example: "$0 n w 'work out 3 times'",
  handler: (() => {
    var _ref = _asyncToGenerator(function* (argv) {
      checkConf();

      let type;
      if (confTypes.includes(argv.type)) {
        type = argv.type;
      } else if (confAliases.hasOwnProperty(argv.type)) {
        type = confAliases[argv.type];
      } else {
        type = argv.type;
      }
      yield newGoal(type, argv.goal);
      ls("all");
    });

    return function handler(_x) {
      return _ref.apply(this, arguments);
    };
  })()
};
//# sourceMappingURL=new.js.map
