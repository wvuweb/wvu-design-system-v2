'use strict';

// Initialize modules
// Importing specific gulp API functions lets us write
//  them below as series() instead of gulp.series().
var { src, dest, watch, series, parallel } = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

// File paths
var files = {
  scssSrc: ['./scss/*.scss', '!./scss/_*.scss'],
  scssWatchPath: './scss/**/*.scss',
  scssDest: './stylesheets',
  jsDevDependenciesBase: './node_modules',
  jsDevDependenciesSrc: [
    './node_modules/twitter-fetcher/js/twitterFetcher_min.js',
    './node_modules/fontfaceobserver/fontfaceobserver.js',
    './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
    './node_modules/responsive-nav/responsive-nav.js'
  ],
  jsDevDependenciesDest: './javascripts/vendor'
};

// This task moves JS files from our `node_modules` folder to the
// root `javascripts/vendor` folder.
// It runs automatically after `npm install/ci` or can be run via
// `npm run postinstall` OR `gulp moveJsFiles`.
function moveJsFiles () {
  return src(files.jsDevDependenciesSrc, { base: files.jsDevDependenciesBase })
    .pipe(rename(function (file) {
    // this removes the last parent directory of the relative file path
      if (file.dirname.split('/').length > 1) {
        file.dirname = file.dirname.split('/')[0];
      }
    }))
    .pipe(dest(files.jsDevDependenciesDest));
}

// Sass Task
// Compile our Sass from the root `./scss` directory
function sassTask () {
  return src(files.scssSrc)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest(files.scssDest));
}

// Watch Task
// Watches our Sass for changes
function watchTask () {
  watch(files.scssWatchPath,
    series(sassTask)
  );
}

// Exports:
exports.moveJsFiles = moveJsFiles;
exports.default = series(
  sassTask, watchTask
);
