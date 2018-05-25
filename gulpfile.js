"use strict";

const gulp = require('gulp'),
      pug = require('gulp-pug'),
      sourcemaps = require('gulp-sourcemaps'),
      del = require('del'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      plumber = require('gulp-plumber'),
      moduleImporter = require('sass-module-importer'),
      browserSync = require('browser-sync').create(),
      gulpWebpack = require('gulp-webpack'),
      webpack = require('webpack'),
      sassGlob = require('gulp-sass-glob'),
      cheerio = require('gulp-cheerio'),
      replace = require('gulp-replace'),
      svgSprite = require('gulp-svg-sprite'),
      svgMin = require('gulp-svgmin'),
      webpackConfig = require('./webpack.config.js');

const paths = {
  root: './docs',
  templates: {
    pages: './src/templates/pages/*.pug',
    src: './src/templates/**/*.pug',
    build: 'docs/assets/'
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './docs/assets/css/'
  },
  images: {
    src: './src/img/**/*.*',
    dest: './docs/assets/img/'
  },
  svg: {
    src: './src/img/icons/*.svg',
    dest: './docs/assets/img/'
  },
  scripts: {
    src: './src/js/**/*.*',
    dest: './build/assets/scripts/'
  }
}

// конфиг для спрайта
const config = {
  mode: {
    symbol: {
      sprite: "../sprite.svg"
    }
  }
};

// слежка
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.svg.src, sprite);
  gulp.watch(paths.scripts.src, scripts);
}

// сервер
function server() {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// svg спрайт
function sprite() {
  return gulp.src(paths.svg.src)
    // минифицируем svg
    .pipe(svgMin({
      js2svg: {
        pretty: true
      }
    }))
    // удалить все атрибуты fill, style and stroke в фигурах
    .pipe(cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    // cheerio плагин заменит, если появилась, скобка '&gt;', на нормальную.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite(config))
    .pipe(gulp.dest(paths.svg.dest));
}

// перенос картинок
function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// обработка js
function scripts() {
  return gulp.src('./src/js/main.js')
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({ stream: true }));
}

// компиляция pug
function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.root));
}

// компиляция scss
function styles() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sassGlob())
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed',
        importer: moduleImporter()
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.styles.dest))
}

// очистка
function clean() {
  return del(paths.root);
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.sprite = sprite;
exports.scripts = scripts;

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(styles, templates, images, sprite),
  gulp.parallel(watch, server)
));
