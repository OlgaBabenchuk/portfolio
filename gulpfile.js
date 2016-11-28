var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    //autoprefixer = require('gulp-autoprefixer'),
    browser      = require('browser-sync'),
    sourcemaps   = require('gulp-sourcemaps'),
    iconfont     = require("gulp-iconfont"),
    consolidate  = require("gulp-consolidate");

gulp.task('sass', function () {
  return gulp.src('assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
          includePaths: require('node-bourbon').includePaths
          //output_style: 'compressed'
        }).on('error', sass.logError))
        //.pipe(autoprefixer(['last 20 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browser.stream({match: '**/*.css'}))
        // .pipe(postcss([ autoprefixer({ browsers: ['last 3 version'] }) ]));
});

gulp.task("build:icons", function() {
    return gulp.src(["./assets/icons/*.svg"])//path to svg icons
      .pipe(iconfont({
        fontName: "myicons",
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true
      }))
      .on("glyphs", function (glyphs) {

        gulp.src("./assets/icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myicons",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("./assets/scss/icons/"));//generated scss files with classes
      })
      .pipe(gulp.dest("dist/fonts/"));//icon font destination
});

// Starts a BrowerSync instance
gulp.task('serve', ['sass'], function(){
  browser.init({
        server: {
            baseDir: "./"
        }
    });
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['serve'], function() {
  gulp.watch(['assets/scss/**/*.scss'], ['sass']);
  gulp.watch('./**/*.html').on('change', browser.reload);
});