const path = require("path");
const fs = require("fs-extra");
const Configstore = require("configstore");
const moment = require("moment");

const date = moment();

const conf = new Configstore("personal-goals-cli", {
  dir: path.join(path.resolve(), "goals"),
  readme: path.resolve(),
  types: ["yearly", "weekly", "monthly", "other"],
  focus: {
    weekly: "Do good things this week",
    monthly: "Do good things this month",
    yearly: "Do good things this year"
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
    weekly: `Weekly Goals ${date.day(1).format("MMM Do, YYYY")}`,
    monthly: `Monthly Goals ${date.format("MMMM YYYY")}`,
    yearly: `Overarching Goals for ${date.format("YYYY")}`,
    today: ` Goals for ${date.format("dddd, MMMM Do YYYY")}`,
    tomorrow: `Goals for ${date.add(1, "d").format("dddd, MMMM Do YYYY")}`
  }
});
const chalk = require("chalk");

module.exports = {
  command: {
    command: "config <key> [value] [detail]",
    aliases: ["cfg", "conf"],
    usage: `$0 config <key> [value]`,
    description: "Set up the personal goals configuration",
    examples: [
      "$0 cfg dir '/user/me/projects/personal-goals'",
      "$0 config weeklyfocus 'get outside more'"
    ],
    handler: argv => {
      const focus = conf.get("focus");
      const aliases = conf.get("alias");
      const titles = conf.get("titles");
      const types = conf.get("types");
      if (argv.value === "clear" || argv.value === "clr" || argv.value === "del" || argv.value === "delete") {
        let value = argv.key;
        let key = argv.value;
        argv.value = value;
        argv.key = key;
        clearConf(argv, { focus, aliases, titles, types });
      } else if (argv.key === "clear" || argv.key === "clr" || argv.key === "del" || argv.key === "delete") {
        clearConf(argv, { focus, aliases, titles, types });
      } else if (argv.key === "ls" || argv.key === "get") {
        console.log(conf.all);
      } else if (argv.key === "type" || argv.key === "types") {
        if (types.includes(argv.value)) {
          console.log(
            chalk.red("Error adding new type: "),
            chalk.bold(argv.value),
            " already exists as a type"
          );
        } else if (typeof aliases[argv.value] === "string") {
          console.log(
            chalk.red("Error adding new type: "),
            chalk.bold(argv.value),
            " already exists as an alias to ",
            chalk.bold(aliases[argv.value])
          );
        } else {
          types.push(argv.value);
          conf.set("types", types);
          console.log(conf.get("types"));
        }
      } else if (
        argv.key === "focus" ||
        argv.key === "focuses" ||
        argv.key === "foci"
      ) {
        if (types.includes(argv.value)) {
          focus[argv.value] = argv.detail;
          conf.set("focus", focus);
        } else if (typeof aliases[argv.value] === "string") {
          focus[aliases[argv.value]] = argv.detail;
          conf.set("focus", focus);
          console.log(conf.get("focus"));
        }
      } else if (argv.key === "alias" || argv.key === "aliases") {
        if (types.includes(argv.value)) {
          console.log(
            chalk.red("Error adding new alias: "),
            chalk.bold(argv.value),
            " already exists as a type"
          );
        } else if (typeof aliases[argv.value] === "string") {
          console.log(
            chalk.red("Error adding new alias: "),
            chalk.bold(argv.value),
            " already exists as an alias to ",
            chalk.bold(aliases[argv.value])
          );
        } else {
          aliases[argv.value] = argv.detail;
          conf.set("alias", aliases);
          console.log(conf.get("alias"));
        }
      } else if (argv.key === "title" || argv.key === "titles") {
        if (types.includes(argv.value)) {
          titles[argv.value] = argv.detail;
          conf.set("titles", titles);
        } else if (typeof aliases[argv.value] === "string") {
          titles[aliases[argv.value]] = argv.detail;
          conf.set("title", titles);
          console.log(conf.get("title"));
        }
      } else {
        conf.set(argv.key, argv.value);
        checkConf();
        console.log(chalk.green("Successfully updated green: "));
        console.log(chalk.bold(argv.key), ":", conf.get(argv.key));
      }
    }
  },

  checkConf,

  conf
};
function clearConf(argv, confs) {
  const { focus, aliases, titles, types } = confs;
  if (typeof argv.value === "string") {
    if (typeof argv.detail === "string") {
      switch (argv.value) {
        case "focus":
        case "focuses":
          if (types.includes(argv.detail)) {
            delete focus[argv.detail];
            conf.set("focus", focus);
            console.log(conf.get("focus"));
          } else if (typeof aliases[argv.detail] === "string") {
            delete focus[argv.detail];
            conf.set("focus", focus);
            console.log(conf.get("focus"));
          } else {
            console.log(
              chalk.red(
                "Error deleting " + chalk.bold(argv.detail) + " focus :"
              ),
              chalk.bold(argv.detail),
              " not found as type or alias"
            );
          }
          break;
        case "title":
        case "titles":
          if (types.includes(argv.detail)) {
            delete titles[argv.detail];
            conf.set("title", titles);
            console.log(conf.get("titles"));
          } else if (typeof aliases[argv.detail] === "string") {
            delete titles[argv.detail];
            conf.set("title", titles);
            console.log(conf.get("titles"));
          } else {
            console.log(
              chalk.red(
                "Error deleting " + chalk.bold(argv.detail) + " title :"
              ),
              chalk.bold(argv.detail),
              " not found as type or alias"
            );
          }
          break;
        case "alias":
        case "aliases":
          if (typeof aliases[argv.detail] === "string") {
            delete aliases[argv.detail];
            conf.set("alias", aliases);
            console.log(conf.get("alias"));
          } else {
            console.log(
              chalk.red(
                "Error deleting " + chalk.bold(argv.detail) + " focus :"
              ),
              chalk.bold(argv.detail),
              " not found as alias"
            );
          }
          break;
        case "types":
        case "type":
          if (types.includes(argv.detail)) {
            Object.keys(aliases).forEach(function(key) {
              if (aliases[key] === argv.detail) {
                delete aliases[key];
              }
            })
            types.splice(types.indexOf(argv.detail), 1);
            conf.set("types", types);
            conf.set("alias", aliases);
            console.log(conf.all);
          } else if (typeof aliases[argv.detail] === "string") {
            let type = aliases[argv.detail]
            Object.keys(aliases).forEach(function(key) {
              if (aliases[key] === type) {
                delete aliases[key];
              }
            })
            types.splice(types.indexOf(type), 1);
            conf.set("types", types);
            conf.set("alias", aliases);
            console.log(conf.all);
          } else {
            console.log(
              chalk.red(
                "Error deleting " + chalk.bold(argv.detail) + " type :"
              ),
              chalk.bold(argv.detail),
              " type not found"
            );
            return;
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
    console.log(conf.all);
  }
}
function checkConf() {
  if (!fs.pathExistsSync(conf.get("dir"))) {
    console.log("setting working directory to ", path.resolve());
    conf.set("dir", path.resolve("goals"));
    conf.set("readme", path.resolve());
  }
}
