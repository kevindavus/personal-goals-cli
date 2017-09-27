"use strict";

var path = require("path");
var fs = require("fs-extra");
var Configstore = require("configstore");
var moment = require("moment");

var date = moment();
var defaultConf = {
  dir: path.join(path.resolve(), "goals"),
  readme: path.resolve(),
  types: ["yearly", "weekly", "monthly", "other"],
  focus: {
    weekly: "Be Awesome."
  },
  alias: {
    w: "weekly",
    week: "weekly",
    m: "monthly",
    month: "monthly",
    y: "yearly",
    year: "yearly",
    o: "other"
  },
  title: {
    weekly: "Things I'll Do This Week",
    monthly: "Things I'll Do This Month (" + date.format("MMMM YYYY") + ") ",
    yearly: "Overarching Goals",
    today: " Goals for " + date.format("dddd, MMMM Do YYYY"),
    tomorrow: "Goals for " + date.add(1, "d").format("dddd, MMMM Do YYYY")
  }
};
var conf = new Configstore("personal-goals-cli", defaultConf);
var chalk = require("chalk");

var confFocus = conf.get("focus");
var confAliases = conf.get("alias");
var confTitles = conf.get("title");
var confTypes = conf.get("types");
var confDir = conf.get("dir");
var confReadme = conf.get("readme");

module.exports = {
  confFocus: confFocus,
  confTypes: confTypes,
  confTitles: confTitles,
  confAliases: confAliases,
  confDir: confDir,
  confReadme: confReadme,
  command: {
    command: "config <key> [value] [detail]",
    aliases: ["cfg", "conf"],
    usage: "$0 config <key> [value]",
    description: "Set up the personal goals configuration",
    examples: ["$0 cfg dir '/user/me/projects/personal-goals'", "$0 config weeklyfocus 'get outside more'"],
    handler: function handler(argv) {
      var completedTask = false;
      completedTask = completedTask || maybeClear(argv);
      completedTask = completedTask || maybeList(argv);
      completedTask = completedTask || maybeAddType(argv);
      completedTask = completedTask || maybeAddFocus(argv);
      completedTask = completedTask || maybeAddAlias(argv);
      completedTask = completedTask || maybeAddTitle(argv);
      if (!completedTask) {
        conf.set(argv.key, argv.value);
        console.log(chalk.green("Successfully updated green: "));
        console.log(chalk.bold(argv.key), ":", conf.get(argv.key));
      }
    }
  },

  checkConf: checkConf,

  conf: conf
};

var maybeClear = function maybeClear(argv) {
  if (argv.value === "clear" || argv.value === "clr" || argv.value === "del" || argv.value === "delete") {
    var _value = argv.key;
    var _key = argv.value;
    argv.value = _value;
    argv.key = _key;
    clearConf(argv);
  } else if (argv.key === "clear" || argv.key === "clr" || argv.key === "del" || argv.key === "delete") {
    clearConf(argv);
    return true;
  }
};

var maybeList = function maybeList(argv) {
  if (argv.key === "ls" || argv.key === "get") {
    console.log(conf.all);
    return true;
  }
};

var maybeAddType = function maybeAddType(argv) {
  if (argv.key === "type" || argv.key === "types") {
    if (confTypes.includes(argv.value)) {
      console.log(chalk.red("Error adding new type: "), chalk.bold(argv.value), " already exists as a type");
    } else if (typeof confAliases[argv.value] === "string") {
      console.log(chalk.red("Error adding new type: "), chalk.bold(argv.value), " already exists as an alias to ", chalk.bold(confAliases[argv.value]));
    } else {
      confTypes.push(argv.value);
      conf.set("types", confTypes);
      console.log(confTypes);
      return true;
    }
  }
};

var maybeAddFocus = function maybeAddFocus(argv) {
  if (argv.key === "focus" || argv.key === "focuses" || argv.key === "foci") {
    if (confTypes.includes(argv.value)) {
      confFocus[argv.value] = argv.detail;
      conf.set("focus", confFocus);
    } else if (typeof confAliases[argv.value] === "string") {
      confFocus[confAliases[argv.value]] = argv.detail;
      conf.set("focus", confFocus);
      console.log(confFocus);
      return true;
    }
  }
};

var maybeAddAlias = function maybeAddAlias(argv) {
  if (argv.key === "alias" || argv.key === "aliases") {
    if (confTypes.includes(argv.value)) {
      console.log(chalk.red("Error adding new alias: "), chalk.bold(argv.value), " already exists as a type");
    } else if (typeof confAliases[argv.value] === "string") {
      console.log(chalk.red("Error adding new alias: "), chalk.bold(argv.value), " already exists as an alias to ", chalk.bold(confAliases[argv.value]));
    } else {
      confAliases[argv.value] = argv.detail;
      conf.set("alias", confAliases);
      console.log(confAliases);
      return true;
    }
  }
};

var maybeAddTitle = function maybeAddTitle(argv) {
  if (argv.key === "title" || argv.key === "titles") {
    if (confTypes.includes(argv.value)) {
      confTitles[argv.value] = argv.detail;
      conf.set("titles", confTitles);
    } else if (typeof confAliases[argv.value] === "string") {
      confTitles[confAliases[argv.value]] = argv.detail;
      conf.set("title", confTitles);
      console.log(confTitles);
      return true;
    }
  }
};

function clearConf(argv) {
  if (typeof argv.value === "string") {
    if (typeof argv.detail === "string") {
      switch (argv.value) {
        case "focus":
        case "focuses":
          if (confTypes.includes(argv.detail)) {
            delete confFocus[argv.detail];
            conf.set("focus", confFocus);
            console.log(confFocus);
          } else if (typeof confAliases[argv.detail] === "string") {
            delete confFocus[argv.detail];
            conf.set("focus", confFocus);
            console.log(confFocus);
          } else {
            console.log(chalk.red("Error deleting " + chalk.bold(argv.detail) + " confFocus :"), chalk.bold(argv.detail), " not found as type or alias");
          }
          break;
        case "title":
        case "titles":
          if (confTypes.includes(argv.detail)) {
            delete confTitles[argv.detail];
            conf.set("title", confTitles);
            console.log(confTitles);
          } else if (typeof confAliases[argv.detail] === "string") {
            delete confTitles[argv.detail];
            conf.set("title", confTitles);
            console.log(confTitles);
          } else {
            console.log(chalk.red("Error deleting " + chalk.bold(argv.detail) + " title :"), chalk.bold(argv.detail), " not found as type or alias");
          }
          break;
        case "alias":
        case "confAliases":
          if (typeof confAliases[argv.detail] === "string") {
            delete confAliases[argv.detail];
            conf.set("alias", confAliases);
            console.log(confAliases);
          } else {
            console.log(chalk.red("Error deleting " + chalk.bold(argv.detail) + " confFocus :"), chalk.bold(argv.detail), " not found as alias");
          }
          break;
        case "types":
        case "type":
          if (confTypes.includes(argv.detail)) {
            Object.keys(confAliases).forEach(function (key) {
              if (confAliases[key] === argv.detail) {
                delete confAliases[key];
              }
            });
            confTypes.splice(confTypes.indexOf(argv.detail), 1);
            conf.set("types", confTypes);
            conf.set("alias", confAliases);
            console.log(conf.all);
          } else if (typeof confAliases[argv.detail] === "string") {
            var type = confAliases[argv.detail];
            Object.keys(confAliases).forEach(function (key) {
              if (confAliases[key] === type) {
                delete confAliases[key];
              }
            });
            confTypes.splice(confTypes.indexOf(type), 1);
            conf.set("types", confTypes);
            conf.set("alias", confAliases);
            console.log(conf.all);
          } else {
            console.log(chalk.red("Error deleting " + chalk.bold(argv.detail) + " type :"), chalk.bold(argv.detail), " type not found");
          }
          break;
        default:
          break;
      }
    } else {
      conf.delete(argv.value);
      console.log(conf.all);
    }
  } else {
    conf.clear();
    conf.set(defaultConf);
    console.log(conf.all);
  }
}

function checkConf() {
  if (!fs.pathExistsSync(confDir)) {
    console.log("setting working directory to ", path.resolve());
    conf.set("dir", path.resolve("goals"));
    conf.set("readme", path.resolve());
  }
}
//# sourceMappingURL=config.js.map
