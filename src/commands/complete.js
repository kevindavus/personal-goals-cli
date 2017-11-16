// @flow

const path = require("path");
const fs = require("fs-extra");
const Menu = require("terminal-menu");
const moment = require("moment");
const { prettyName, getFileName } = require("../utils/file");
const { checkConf, confTypes, confAliases, confDir } = require("./config");
const { ls } = require("./ls");
const { write } = require("../utils/markdown");

module.exports = {
  command: "complete [type] [goal]",
  aliases: ["c"],
  desc: "mark a goal as completed",
  example: "$0 c w ",
  builder: (yargs: { default: (string, string) => mixed }) =>
    yargs.default("type", "w"),
  handler: (argv: { type: string, goal: string }) => {
    checkConf();

    let type: string;
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

function completeGoal(type: string, goal: string): void {
  const date = moment().format("MMMDDYYYYHHmm");
  const dir = path.join(confDir, "completed", type, date);

  fs
    .move(
      getFileName(type, goal),
      getFileName(path.join("completed", type, date), goal)
    )
    .then(() => {
      ls("all")
      write();
    });
}

async function menu(type: string): Promise<void> {
  checkConf();
  const dir = getFileName(type, "");
  await fs.ensureDir(dir);
  const files = await fs.readdir(dir);
  try {
    const menu = new Menu({ bg: "black", fg: "white", width: 100 });

    menu.reset();
    menu.write("Which " + prettyName(type) + " Goal Did You Complete?\n");
    menu.write("-------------------------------------\n");
    files.map((item: string) => {
      if (!item.startsWith(".")) {
        menu.add(prettyName(item));
      }
    });
    menu.add("None");

    menu.on("select", (label: string) => {
      menu.close();
      if (label === "None") {
        return;
      }
      completeGoal(type, label);
    });
    process.stdin.pipe(menu.createStream()).pipe(process.stdout);

    process.stdin.setRawMode(true);
    menu.on("close", () => {
      process.stdin.setRawMode(false);
      process.stdin.end();
    });
  } catch (err) {
    console.error(err);
  }
}
