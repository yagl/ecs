/* jshint node:true */

const to5 = require('gulp-6to5');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// Remove the built files
gulp.task('clean', function(callback) {
  var del = require('del');
  del(['dist'], callback);
});

// Send a notification when JSHint fails,
// so that you know your changes didn't build
function ding(file) {
  return file.jshint.success ? false : 'JSHint failed';
};

// Lint our source code
gulp.task('lint:src', function() {
  return gulp.src(['src/**/*.js', '!src/wrapper.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify(ding))
    .pipe($.jshint.reporter('fail'));
});

// Lint our test code
gulp.task('lint:test', function() {
  return gulp.src(['test/unit/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify(ding))
    .pipe($.jshint.reporter('fail'));
});

// Compile library to ECMAScript 5
gulp.task('build', ['lint:src', 'clean'], function() {
  return gulp.src('src/**/*.js')
    .pipe(to5({blacklist: ['useStrict'], modules: 'common'}))
    .pipe(gulp.dest('dist'))
});

// Create a coverage report
gulp.task('coverage', function(done) {
  require('6to5/register')({ modules: 'common' });
  gulp.src(['src/**/*.js'])
    .pipe($.istanbul())
    .on('finish', function() {
      return test()
        .pipe($.istanbul.writeReports())
        .on('end', done);
    });
});

// Lint and run our tests
gulp.task('test', ['lint:src', 'lint:test'], function() {
  require('6to5/register')({modules: 'common'});
  return test();
});

// Lint and run our tests. It creates a xunit report also
gulp.task('test:ci', ['lint:src', 'lint:test'], function() {
  require('6to5/register')({modules: 'common'});
  return test('xunit-file');
});

function test(reporterName) {
  reporterName = !reporterName ? 'spec' : reporterName;
  return gulp.src(['test/setup.js', 'test/unit/**/*.js'], {read: false})
    .pipe($.mocha({reporter: reporterName, growl: true}));
};

// Watch files for changes & reload
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['lint:src', 'test']);
  gulp.watch('test/**/*.js', ['lint:test', 'test']);
});

// An alias of test
gulp.task('default', ['test', 'watch']);
