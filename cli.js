#!/usr/bin/env node
"use strict";

const yargs = require("yargs");
const config = require("./lib/config").command;
const clear = require("./lib/clear");
const ls = require("./lib/ls").command;
const complete = require("./lib/complete");
const newCommand = require("./lib/new");

yargs // eslint-disable-line no-unused-expressions
  .command(newCommand)
  .command(complete)
  .command(ls)
  .command(clear)
  .command(config)
  .group("weekly (w)", "Types")
  .group("monthly (m)", "Types")
  .group("other (o)", "Types")
  .group("completed (c)", "Types")
  .group("all (a)", "Types")
  .example("ls", "$0 ls")
  .example("ls", "$0 ls complete")
  .example("ls", "$0 list all")
  .example("new", `$0 new w 'work out 3 times' `)
  .example("new", `$0 n m 'lose 5 pounds'`)
  .example("complete", "$0 c other")
  .example("complete", `$0 complete week 'work out 3 times'`)
  .example("config", "$0 cfg dir '/user/me/projects/personal-goals'")
  .example("config", `$0 config focus weekly 'get outside more'`)
  .example(
    "complete",
    "$0 config focus m 'punch as many nazis as possible'"
  )
  .example("config", `$0 cfg focus year 'destroy all nazis'`)
  .example("config", `$0 config type 'today'`)
  .example("config", `$0 cfg alias t today`)
  .example("config", `$0 conf title t 'All the things I want to do today'`)
  .example("config", `$0 cfg ls`)
  .example("clear", "$0 clear all")
  .example("clear", `$0 clear weekly`)
  .help().argv;

if (yargs.argv._.length === 0) {
  yargs.showHelp();
}
