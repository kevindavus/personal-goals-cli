const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");
const { conf, checkConf } = require("../config");
const prettyName = require("./file").prettyName;
const date = moment();

let md = {
  yearly: `<!-- goals yearly start-->
  # Overarching Goals for ${date.format("YYYY")}:
  ### This year's focus: ${conf.get("yearlyfocus") || ""}
  
    
  ${markdownPrint("yearly")}${markdownPrint("completed/yearly")}<!-- goals yearly end-->`,
  monthly: `<!-- goals monthly start-->
  # Monthly Goals ${date.format("MMMM YYYY")}:
  ### This month's focus: ${conf.get("monthlyfocus") || ""}
  
  ${markdownPrint("monthly")}${markdownPrint("completed/monthly")} <!-- goals monthly end-->`,
  weekly: `<!-- goals weekly start-->
  # Weekly Goals ${date.day(1).format("MMM Do, YYYY")}:
  ### This week's focus: ${conf.get("weeklyfocus") || ""}
  
  ${markdownPrint("weekly")}${markdownPrint("completed/weekly")}<!-- goals weekly end-->`,
  other: `<!-- goals other start-->
  # Other Goals:
  
  ${markdownPrint("other")}${markdownPrint("completed/other")}<!-- goals other end-->`
}

module.exports = {
  write() {
    checkConf();
    if (fs.existsSync(path.join(conf.get("readme"), "README.md"))){
      let readme = read();
      fs.truncate(path.join(conf.get("readme"), "README.md"), 0, () => {
        fs.writeFile(
          path.join(conf.get("readme"), "README.md"),
          readme,
          err => {
            if (err) {
              return console.log("Error writing file: " + err);
            }
          }
        );
      });
    } else {
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
  }
};

function generate() {
  const res = `
Personal Goals
==============
Personal goals made open source for accessibility across computers I use, transparency, accountability, and versioning. Learn more about it [here](http://una.im/personal-goals-guide).
${md.yearly}${md.weekly}${md.monthly}${md.other}
`;
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

function read() {
  let readme = fs.readFileSync(path.join(conf.get("readme"), "README.md"),'utf8');
  let res = ''
  let idx = readme.search(/<!-- goals (\S+) start-->/i)
  while(idx !== -1) {
    let stats = readme.match(/<!-- goals (\S+) start-->/i);
    res+=readme.substring(0,idx);
    // console.log(md[stats[1]]);
    res+=md[stats[1]];
    readme = readme.substr(readme.search(/<!-- goals (\S+) end-->/i)+readme.match(/<!-- goals (\S+) end-->/g)[0].length)
    idx = readme.search(/<!-- goals (\S+) start-->/i)
  }
  return res;
}
