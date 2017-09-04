const path = require("path");
const fs = require("fs-extra");
const { conf, checkConf } = require("./config");

module.exports = {
  command: "clear [type]",
  aliases: ["clr"],
  usage: `$0 clear  <w, m, y, o, c, a>`,
  description: `clear goals of a type`,
  builder: yargs => yargs.default("type", "a"),
  handler: argv => {
    checkConf();

    let type;
    if (conf.get("types").includes(argv.type)) {
      type = argv.type;
    } else if (typeof conf.get("alias")[argv.type] === "string") {
      type = conf.get("alias")[argv.type];
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
    clear(type);
  }
};

function clear(type) {
  if (type === "all") {
    fs.removeSync(path.join(conf.get("dir")));
  } else {
    fs.removeSync(path.join(conf.get("dir"), type));
  }
}
