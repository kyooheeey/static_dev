/*
 * plugin
 */
const { src, dest, watch, parallel, series } = require('gulp');
const $ = require('gulp-load-plugins')();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();
const del = require('del');
const fs = require('fs');
const prettier = require('gulp-prettier');
const minimist = require('minimist');
const webp = require('gulp-webp');

/*
 * env
 */
const envOption = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development',
  }
};
const options = minimist(process.argv.slice(2), envOption);
const isProduction = options.env === 'production';

/*
 * config
 */
const config = {
  development: {
    root: 'dist',
    path: {
      absolute: 'http://localhost:3000',
      relative: '/',
    }
  },
  production: {
    root: 'prod',
    path: {
      absolute: 'http://localhost:3000',
      relative: '/',
    }
  }
};

/*
 * tasks
 */
const TASK__scss = () => {
  return src('./src/assets/scss/style.scss')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: [
        'node_modules',
        'node_modules/node-reset-scss/scss',
        'node_modules/normalize.css'
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest(`${config[options.env].root}/assets/css`));
};

const TASK__css = () => {
  return src(`./${config[options.env].root}/assets/css/style.css`)
    .pipe($.header('@charset "utf-8";\n'))
    .pipe($.cleanCss())
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(dest(`${config[options.env].root}/assets/css`));
};

const TASK__ejs = () => {
  const json = JSON.parse(fs.readFileSync('./src/ejs/data.json'));
  return src('./src/ejs/**/[^_]*.ejs')
    .pipe($.plumber())
    .pipe($.data(() => ({ path: config[options.env].path })))
    .pipe($.ejs(json, { ext: '.html' }))
    .pipe($.rename({ extname: '.html' }))
    .pipe(prettier({
      singleQuote: true,
      tabWidth: 2,
      printWidth: 100,
      htmlWhitespaceSensitivity: 'css'
    }))
    .pipe(dest(`./${config[options.env].root}`));
};

const TASK__inc = (done) => {
  return !isProduction ? done() : src('./src/ejs/play/**/!(panel)*.ejs')
    .pipe($.plumber())
    .pipe($.data(() => ({ path: config[options.env].path })))
    .pipe($.ejs())
    .pipe($.rename({ extname: '.inc' }))
    .pipe(dest(`./${config[options.env].root}`));
};

const TASK__imagemin = () => {
  return src('src/assets/images/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe($.imagemin([
      pngquant({ quality: [.65, .85], speed: 1 }),
      mozjpeg({ quality: 85, progressive: true })
    ]))
    .pipe(dest(`${config[options.env].root}/assets/images`));
};

const TASK__webp = () => {
  return src('src/assets/images/**/*.{jpg,jpeg,png}')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(webp({
      quality: 80,
      method: 6
    }))
    .pipe(dest(`${config[options.env].root}/assets/images`));
};

const TASK__webpack = () => {
  return webpackStream({
    entry: './src/assets/js/script.js',
    output: { filename: 'bundle.js' },
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }, webpack)
    .pipe(dest(`${config[options.env].root}/assets/js`));
};

const TASK__minjs = () => {
  return src(`${config[options.env].root}/assets/js/bundle.js`)
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(dest(`${config[options.env].root}/assets/js/`));
};

const TASK__json = () => {
  return src('./src/data/**/*.json')
    .pipe($.jsonminify())
    .pipe(dest(`${config[options.env].root}/data/`));
};

/*
 * browserSync
 */
const browserSyncOption = {
  server: { baseDir: config[options.env].root },
  middleware: [ (req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); } ],
  reloadOnRestart: true
};

const sync = done => {
  browserSync.init(browserSyncOption);
  done();
};

const watchFiles = done => {
  const browserReload = () => { browserSync.reload(); done(); };
  watch('src/assets/scss/**/*.scss').on('change', series(parallel(series(TASK__scss, TASK__css)), browserReload));
  watch('src/ejs/**/*.ejs').on('change', series(parallel(series(TASK__ejs, TASK__inc)), browserReload));
  watch('src/assets/js/**/*.js').on('change', series(parallel(series(TASK__webpack, TASK__minjs)), browserReload));
  watch('src/assets/data/**/*.json').on('change', series(TASK__json, browserReload));
};

/*
 * clean
 */
const TASK__clean = () => {
  return isProduction ? del('prod/*') : del('dist/*');
};

/*
 * scripts
 */
const scripts = parallel(
  series(TASK__scss, TASK__css),
  series(TASK__ejs, TASK__inc),
  series(TASK__webpack, TASK__minjs),
  TASK__json,
  TASK__imagemin,
  TASK__webp
);

exports.default = series(scripts, sync, watchFiles);
exports.build = series(TASK__clean, scripts);
