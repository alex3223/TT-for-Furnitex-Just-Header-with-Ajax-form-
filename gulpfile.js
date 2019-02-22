'use strict';

const { task, series, parallel, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const notify = require('gulp-notify');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const mqpacker = require('css-mqpacker');


const plugins = [
    autoprefixer({ browsers: ['last 5 versions', '> 1%'], cascade: true }),
    mqpacker()
];

const path = {
    scssFile: "./assets/scss/style.scss",
    scssFiles: "./assets/scss/**/*.scss",
    scssFolder: "./assets/scss",
    cssFolder: "./assets/css",
    htmlFiles: "./*.html",
    jsFiles: "assets/js/**/*.js"
}

function scss() {
    return src(path.scssFile)
        .pipe(sass({ outputStyle: 'expanded' })
            .on('error', sass.logError))
        .pipe(postcss(plugins))    
        .pipe(csscomb('csscomb.json'))
        .pipe(dest(path.cssFolder))
        .pipe(notify({ message: 'Compiled!', sound:false}))
        .pipe(browserSync.reload({ stream: true }));
}

function scssMin() {
        const pluginsExtended =
    plugins.concat([cssnano({preset: 'default'})]);    
    return src(path.scssFile)
        .pipe(sass({ outputStyle: 'expanded' })
            .on('error', sass.logError))
        .pipe(postcss(pluginsExtended))    
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(path.cssFolder))
        .pipe(notify({ message: 'Complied!', sound: false}))
        .pipe(browserSync.reload({ stream: true }));
}

function scssDev() {
    return src(path.scssFile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' })
            .on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(dest(path.cssFolder))
        .pipe(notify({ message: 'Compiled!', sound: false }))
        .pipe(browserSync.reload({ stream: true }));
}

function comb() {
    return src(path.scssFiles)
    .pipe(csscomb())
    .on('error', notify.onError(function (error) {
    return 'File: ' + error.message;
    }))
    .pipe(dest(path.scssFolder))
    }


async function syncInit() {
    browserSync({
        server: {
            baseDir: './'
        },
        notify: false
    });
}

async function sync () {
    browserSync.reload();
}

function watchFiles() {
    syncInit();
    watch(path.scssFiles, scss);
    watch(path.htmlFiles, sync);
    watch(path.jsFiles, sync);
}


task('scss', scss);
task('min', scssMin);
task('dev', scssDev);
task('comb', comb);
task('watch', watchFiles);