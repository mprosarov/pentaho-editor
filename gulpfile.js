const {src,dest,watch, task, series} = require('gulp');
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
var browserSync = require("browser-sync").create();

function buildRigger(cb){
    src('src/index.html').pipe(rigger()).pipe(dest('dist/'));
    src('src/preview.html').pipe(rigger()).pipe(dest('dist/'));
    src("src/js/app.js").pipe(rigger()).pipe(dest("dist/js/"));
    browserSync.reload();
    cb();
}

function styles(cb) {
    src("src/scss/app.scss").pipe(sass()).pipe(dest('dist/css/'));
    src("src/scss/preview.scss").pipe(sass()).pipe(dest('dist/css/'));
    browserSync.reload();
    cb();
}

function copyAssets(cb){
  console.log('-----------!!!!!!!!!!---------------');
  src("src/assets/**/*").pipe(dest("dist/assets/"));
  cb()
}
// task(copyAssets);
// task("default", series("copyAssets"));
exports.default = function(){
    browserSync.init({
      server: {
        baseDir: "./dist/",
      },
    });

    watch("src/*.html",buildRigger);
    watch("src/blocks/*.html", buildRigger);
    watch("src/componentTemplates/*.html", buildRigger);
    watch("src/scss/*.scss",styles);
    watch("src/js/*.js", buildRigger);
}

exports.copyAssets = copyAssets;
exports.buildRigger = buildRigger;
exports.styles = styles;
