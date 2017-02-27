var gulp = require('gulp');
var browserSync = require('browser-sync').create();

module.exports = gulp.task('dev', function () {
  browserSync.init({
    server: {
      index: 'index.html'
    }
  });
    setTimeout(function () {
      browserSync.reload()
    }, 500)
});
