var gulp = require('gulp');
var browserSync = require('browser-sync').create();

module.exports = gulp.task('dev', function () {
  browserSync.init({
    server: {
      baseDir: 'build/public',
      index: 'index.html'
    }
  });
  gulp.watch('index.html', ['copy-index']);
  //gulp.watch('m/**/*', ['copy-m']);
  gulp.watch([
    '/home/masted/ngn-env/ngn/i/js/ngn/**/*.js',
    '/home/masted/ngn-env/ngn/i/css/**/*.css',
    'm/**/*'
  ], ['ngn-build']);

  gulp.watch([
    'build/public/index.html'
  ], ['ngn-build']);

  gulp.watch([
    'build/public/m/css/*.css',
    'build/public/m/js/*.js',
    'build/public/index.html'
  ]).on('change', function() {
    setTimeout(function () {
      browserSync.reload()
    }, 500)
  });
  gulp.watch([
    'models/*.json'
  ], ['crud-routes-gen', 'mongoose-scheme-gen', 'ngn-form-build']);
});
