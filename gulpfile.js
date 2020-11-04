var gulp = require('gulp');
var srcDirectory = './src';

// Modules
var src = gulp.src;
var dest = gulp.dest;
var parallel = gulp.parallel;
var series = gulp.series;
var watch = gulp.watch;
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');

// Browser sync
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'build/',
    },
    notify: false,
    online: true,
  });
}

// Watchers
function startwatch() {
  watch(srcDirectory + '/styles' + '/**/*', { usePolling: true }, styles);
  watch(srcDirectory + '/**/*.html', { usePolling: true }, html);
}

// Html
function html() {
  return src('./src/index.html')
    .pipe(concat('index.html'))
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
}

// Styles
function styles() {
  return src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })
    )
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest('./build/'))
    .pipe(browserSync.stream());
}

exports.browsersync = browsersync;
exports.assets = series(styles, html);
exports.styles = styles;
exports.html = html;

exports.default = parallel(styles, html, browsersync, startwatch);
