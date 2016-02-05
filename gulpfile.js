var gulp = require('gulp'); // gulp core
var plumber = require('gulp-plumber'); // prevent pipeline from breaking on error
var stylus = require('gulp-stylus'); // Плагин для Stylus
var autoprefixer = require('gulp-autoprefixer'); // css autoprefixer
var cssmin  = require('gulp-minify-css'); // css minify
var replace  = require('gulp-replace'); // replace
var concat  = require("gulp-concat");// rename files
var uglify  = require('gulp-uglify'); // minify javascript
var sourcemaps = require('gulp-sourcemaps'); // sourcemaps
var livereload = require("gulp-livereload"); // livereload

var CSS_PATH = 'assets/css/';
var JS_PATH  = 'assets/js/';

/**
 * @see https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md - documentation
 * @see http://jkphl.github.io/svg-sprite/#gulp - configurator
 */

gulp.task('stylus', function () {
  return gulp.src([CSS_PATH + 'stylus/app.styl'])
    .pipe(stylus())
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(cssmin())
    .pipe(autoprefixer({
      browsers: ['last 3 versions','ie >= 9'],
      cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CSS_PATH))
    .pipe(livereload())
    ;
});

gulp.task('js', function () {
  return gulp.src([
    JS_PATH + 'classes/*.js',
    JS_PATH + 'app/*.js'
  ])
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(concat('script.min.js'))
  //.pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(JS_PATH))
  .pipe(livereload())
  ;
});

gulp.task('watch', ['js', 'stylus'], function() {
  livereload.listen();
  gulp.watch( CSS_PATH + '*.css', ['css']);
  gulp.watch( CSS_PATH + 'stylus/*.styl', ['stylus']);
  gulp.watch( JS_PATH + '*.js', ['js']);
});

gulp.task('default', ['js', 'stylus']);