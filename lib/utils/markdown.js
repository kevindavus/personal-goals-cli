const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");
const { conf, checkConf } = require("../config");
const prettyName = require("./file").prettyName;

module.exports = {
  write() {
    checkConf();
    fs.truncate(path.join(conf.get("readme"), "README.md"), 0, () => {
      fs.writeFile(
        path.join(conf.get("readme"), "README.md"),
        generate(),
        err => {
          if (err) {
            return console.log("Error writing file: " + err);
          }
        }
      );
    });
  }
};

function generate() {
  const date = moment().day(0);
  const res = `
Personal Goals
==============
Personal goals made open source for accessibility across computers I use, transparency, accountability, and versioning. Learn more about it [here](http://una.im/personal-goals-guide).

# Overarching Goals for ${date.format("YYYY")}:
### This year's focus: ${conf.get("yearlyfocus") || ""}

  
${markdownPrint("yearly")}${markdownPrint("completed/yearly")}
  
# Weekly Goals ${date.format("MMM Do, YYYY")}:
### This week's focus: ${conf.get("weeklyfocus") || ""}

${markdownPrint("weekly")}${markdownPrint("completed/weekly")}

# Monthly Goals ${date.format("MMMM YYYY")}:
### This month's focus: ${conf.get("monthlyfocus") || ""}

${markdownPrint("monthly")}${markdownPrint("completed/monthly")}  

# Other Goals:

${markdownPrint("other")}${markdownPrint("completed/other")}`;
  return res;
}

function markdownPrint(type, opts = {}) {
  const dir = path.join(conf.get("dir"), type);
  fs.ensureDirSync(dir);
  let res = "";
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
  }
  files.forEach(item => {
    if (!item.startsWith(".")) {
      const stats = fs.statSync(path.join(dir, item));
      if (stats.isDirectory()) {
        if (item.match(/\w{3}\d{5,6}/g)) {
          opts.date = item;
        } else {
          res += `\n***${item}***\n`;
        }
        res += markdownPrint(path.join(type, item), opts);
      } else if (stats.isFile()) {
        if (typeof opts.date === "string") {
          res += `* [x] ${prettyName(item)} _- ${moment(
            opts.date,
            "MMMDDYYYYHHmm"
          ).format("MMMM Do YYYY")}_\n`;
        } else {
          res += `* [ ] ${prettyName(item)}\n`;
        }
      }
    }
  });
  return res;
}
