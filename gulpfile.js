'use strict';

// Initialize modules
// Importing specific gulp API functions lets us write
//  them below as series() instead of gulp.series().
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

// File paths
const files = {
  scssSrc: ['./scss/*.scss', '!./scss/_*.scss'],
  scssWatchPath: './scss/**/*.scss',
  scssDest: './stylesheets',
  jsDevDependenciesBase: './node_modules',
  jsDevDependenciesSrc: [
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    './node_modules/parvus/dist/js/parvus.min.js',
    './node_modules/responsive-nav/client/dist/responsive-nav.js',
    './node_modules/twitter-fetcher/js/twitterFetcher_min.js'
  ],
  jsDevDependenciesDest: './javascripts/vendor'
};

// This task moves JS files from our `node_modules` folder to the
// root `javascripts/vendor` folder.
// It runs automatically after `npm install/ci` or can be run via
// `npm run postinstall` OR `gulp moveJsFiles`.
function moveJsFiles (done) {
  src(files.jsDevDependenciesSrc, { base: files.jsDevDependenciesBase })
    .pipe(rename(function (file) {
    // this removes the last parent directory of the relative file path
      if (file.dirname.split('/').length > 1) {
        file.dirname = file.dirname.split('/')[0];
      }
    }))
    .pipe(dest(files.jsDevDependenciesDest));
  done();
}

// Sass Task
// Compile our Sass from the root `./scss` directory
function sassTask (done) {
  src(files.scssSrc)
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest(files.scssDest));
  done();
}

// Watch Task
// Watches our Sass for changes
function watchTask (done) {
  watch(files.scssWatchPath,
    series(sassTask)
  );
  done();
}

// Exports:
exports.moveJsFiles = moveJsFiles;
exports.default = series(
  sassTask, watchTask
);
