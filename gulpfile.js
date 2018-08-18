const del = require('del');
const pug = require('gulp-pug');
const gulp = require('gulp');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');

const options = {
  pug: {
    basedir: 'src',
    verbose: true
  },
  cleanCSS: {
    sourceMap: true,
  },
  babel: {
    presets: ['env']
  }
};

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 7777,
    open: false,
    notify: false
  });
});

gulp.task('pug', function() {
  return gulp
    .src('./src/pages/**/*.pug')
    .pipe(pug(options.pug))
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
  return gulp
    .src('./src/styles/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('styles:build', function() {
  return gulp
    .src('./src/styles/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(cleanCSS(options.cleanCSS))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js').pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts:build', function() {
  return gulp
    .src('./src/js/*.js')
    .pipe(babel(options.babel))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('assets', function() {
  return gulp.src('./src/assets/**/*').pipe(gulp.dest('./dist/assets'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'pug', 'styles:build', 'scripts:build', 'assets']);

gulp.task('watch', ['clean', 'pug', 'styles', 'scripts', 'assets', 'serve'], function() {
  gulp.watch(
    ['./src/styles/*.styl', './src/blocks/**/*.styl'],
    ['styles', browserSync.reload]
  );
  gulp.watch('./src/js/*.js', ['scripts', browserSync.reload]);
  gulp.watch('./src/assets/**/*', ['assets', browserSync.reload]);
  gulp.watch(
    ['./src/blocks/**/*.pug', './src/pages/**/*.pug'],
    ['pug', browserSync.reload]
  );
});

gulp.task('default', ['watch']);
