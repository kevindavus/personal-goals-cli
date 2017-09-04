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
      if (argv.value === "clear" || argv.value === "clr") {
        conf.delete(argv.key);
      } else if (argv.key === "clear" || argv.key === "clr") {
        clearConf(argv, { focus, aliases, titles, types });
      } else if (argv.key === "ls" || argv.key === "get") {
        console.log(conf.all);
      } else if (argv.key === "type") {
        if (types.includes(argv.value)) {
          console.log(
            chalk.red("Error adding new type: "),
            chalk.bold(argv.value),
            " already exists"
          );
        } else {
          types.push(argv.value);
          conf.set("types", types);
        }
      } else if (argv.key === "focus") {
        if (types.includes(argv.value)) {
          focus[argv.value] = argv.detail;
          conf.set("focus", focus);
        } else if (typeof aliases[argv.value] === "string") {
          focus[aliases[argv.value]] = argv.detail;
          conf.set("focus", focus);
        }
      } else if (argv.key === "alias") {
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
        }
      } else if (argv.key === "title") {
        if (types.includes(argv.value)) {
          titles[argv.value] = argv.detail;
          conf.set("titles", titles);
        } else if (typeof aliases[argv.value] === "string") {
          titles[aliases[argv.value]] = argv.detail;
          conf.set("title", titles);
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
          if (types.includes(argv.detail)) {
            focus.delete(argv.detail);
            conf.set("focus", focus);
          } else if (typeof aliases[argv.detail] === "string") {
            focus.delete(aliases[argv.detail]);
            conf.set("focus", focus);
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
          if (types.includes(argv.detail)) {
            titles.delete(argv.detail);
            conf.set("title", titles);
          } else if (typeof aliases[argv.detail] === "string") {
            titles.delete(aliases[argv.detail]);
            conf.set("title", titles);
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
          if (typeof aliases[argv.detail] === "string") {
            focus.delete(aliases[argv.detail]);
            conf.set("focus", focus);
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
          if (types.includes(argv.detail)) {
            types.splice(types.indexOf(argv.detail), 1);
            conf.set("types", types);
          } else {
            console.log(
              chalk.red(
                "Error deleting " + chalk.bold(argv.detail) + " type :"
              ),
              chalk.bold(argv.detail),
              " type not found"
            );
          }
          break;
        default:
          break;
      }
    } else {
      conf.delete(argv.value);
    }
  } else {
    conf.clear();
  }
}
function checkConf() {
  if (!fs.pathExistsSync(conf.get("dir"))) {
    console.log("setting working directory to ", path.resolve());
    conf.set("dir", path.resolve("goals"));
    conf.set("readme", path.resolve());
  }
}
