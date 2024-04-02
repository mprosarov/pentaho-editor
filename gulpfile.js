const {src,dest,watch} = require('gulp');
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
var browserSync = require("browser-sync").create();

function buildRigger(cb){
    src('src/index.html').pipe(rigger()).pipe(dest('dist/'));
    src("src/js/app.js").pipe(rigger()).pipe(dest("dist/js/"));
    browserSync.reload();
    cb();
}

function styles(cb) {
    src("src/scss/app.scss").pipe(sass()).pipe(dest('dist/css/'));
    browserSync.reload();
    cb();
}

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

exports.buildRigger = buildRigger;
exports.styles = styles;