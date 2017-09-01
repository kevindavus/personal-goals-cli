const fs = require("fs-extra");
const path = require("path");

module.exports = {
  command: "clear [type]",
  aliases: ["clr"],
  usage: `$0 clear  <w, m, y, o, c, a>`,
  description: `clear goals of a type`,
  builder: yargs => yargs.default("type", "a"),
  handler: argv => {
    checkConf();

    let type;
    switch (argv.type) {
      case "weekly":
      case "week":
      case "w":
        type = "weekly";
        break;
      case "monthly":
      case "month":
      case "m":
        type = "monthly";
        break;
      case "yearly":
      case "year":
      case "y":
        type = "yearly";
        break;
      case "other":
      case "o":
        type = "other";
        break;
      case "all":
      case "a":
        type = "all";
        break;
      default:
        type = argv.type;
        break;
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
