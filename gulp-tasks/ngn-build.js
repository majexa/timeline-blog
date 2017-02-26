var gulp = require('gulp');
var ngnJs = require('gulp-ngn-js');
var ngnCss = require('gulp-ngn-css');

module.exports = gulp.task('ngn-build', function () {
  var opt = {
    ngnEnvFolder: '/home/masted/ngn-env',
    buildFolder: 'build/public/m',
    projectFolder: '/home/masted/www/timeline-blog',
    name: 'main'
  };
  gulp.src('index.html', {read: false})
    .pipe(ngnJs(opt))
    .pipe(ngnCss(opt))
});
