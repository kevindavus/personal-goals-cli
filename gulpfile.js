const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const flow = require("gulp-flowtype");

gulp.task("scripts", () => {
  console.log('babel');
  return gulp
    .src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("lib"));
});

gulp.task("flow", () => {
  return gulp.src("src/**/*.js").pipe(flow({ killFlow: false }));
});

gulp.task("watch", ["flow", "scripts"], () => {
  gulp.watch("src/**/*.js", ["flow", "scripts"]);
});

gulp.task("default", ["watch"]);
