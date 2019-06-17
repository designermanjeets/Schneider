var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var Server = require('karma').Server;
var webserver = require('gulp-webserver');
var runSequence = require('run-sequence');
var wrap = require('gulp-wrap');

var SRC_JS = [
  'node_modules/snapsvg/dist/snap.svg-min.js',
  'src/*.js',
];
var SRC_IMAGE = 'src/quick_setup.svg';
var SRC_CSS = 'src/powerflow.css';
var INPUT_DIR = "src";
var OUTPUT_DIR = 'dist';

function runKarma(singleRun, callback) {
  var onComplete = function(error, result) {
    // swallow errors
    callback(null, result);
  };

  // var browsers
  // if (yargs.argv.chrome) {
  //   browsers = ['Chrome']
  // } else if (yargs.argv.ie) {
  //   // Use this to ensure that we're not using JavaScript functions that
  //   // IE doesn't support
  //   browsers = ['IE'];
  // } else {
  browsers = ['PhantomJS'];
  // }

  return new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: singleRun,
    browsers: browsers,
  }, onComplete).start();
}

gulp.task('test', function(callback) {
  runKarma(true /* singleRun */ , callback);
});

gulp.task('default', function() {
  runSequence('wrap-svg-container', 'wrap-xw-svg', 'wrap-ags-svg', 'wrap-battmon-svg', 'wrap-csw-svg', 'javascript', 'css');
});

gulp.task('wrap-svg-container', function() {
  return gulp.src(SRC_IMAGE)
    .pipe(wrap('function SVGLoadService(){ this.getPowerflow = loadSVG; function loadSVG() { return `<%= contents %>`;}}'))
    .pipe(concat('svgLoadService.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(INPUT_DIR));
});

gulp.task('wrap-xw-svg', function() {
  return gulp.src('src/images/xw.svg')
    .pipe(wrap('function XWImageService(){ this.getImage = loadSVG; function loadSVG() { return `<%= contents %>`;}}'))
    .pipe(concat('xwImageService.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(INPUT_DIR));
});

gulp.task('wrap-ags-svg', function() {
  return gulp.src('src/images/ags.svg')
    .pipe(wrap('function AGSImageService(){ this.getImage = loadSVG; function loadSVG() { return `<%= contents %>`;}}'))
    .pipe(concat('agsImageService.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(INPUT_DIR));
});

gulp.task('wrap-battmon-svg', function() {
  return gulp.src('src/images/battmon.svg')
    .pipe(wrap('function BattmonImageService(){ this.getImage = loadSVG; function loadSVG() { return `<%= contents %>`;}}'))
    .pipe(concat('battmonImageService.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(INPUT_DIR));
});

gulp.task('wrap-csw-svg', function() {
  return gulp.src('src/images/csw.svg')
    .pipe(wrap('function CSWImageService(){ this.getImage = loadSVG; function loadSVG() { return `<%= contents %>`;}}'))
    .pipe(concat('cswImageService.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(INPUT_DIR));
});

gulp.task('javascript', function() {
  return gulp.src(SRC_JS)
    .pipe(concat('quick_setup.js'))
  //  .pipe(uglify())
    .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('image', function() {
  return gulp.src(SRC_IMAGE)
    .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('css', function() {
  return gulp.src(SRC_CSS)
    .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: true,
      middleware: []
    }));
});
