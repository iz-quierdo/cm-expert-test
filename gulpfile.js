// File types to watch
const fileswatch = 'html,htm,txt,json,md,woff2';
const srcDirectory = './src';

// Modules
const {src, dest, parallel, series, watch} = require('gulp');
const scss = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

// Browser sync
function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'build/'
        },
        notify: false,
        online: true
    })
}

// Watchers
function startwatch() {
    watch(srcDirectory + '/styles' + '/**/*', {usePolling: true}, styles);
    watch(srcDirectory + '/**/*.html', {usePolling: true}, html);
}

// Html
function html() {
    return src('./src/index.html')
        .pipe(concat('index.html'))
        .pipe(dest('./build'))
        .pipe(browserSync.stream())
}

// Styles
function styles() {
    return src('./src/styles/**/*.scss')
        .pipe(eval('scss')())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true}))
        .pipe(cleancss({level: {1: {specialComments: 0}},}))
        .pipe(dest('./build/'))
        .pipe(browserSync.stream())
}

exports.browsersync = browsersync;
exports.assets = series(styles, html);
exports.styles = styles;
exports.html = html;

exports.default = parallel(styles, html, browsersync, startwatch);
