var gulp = require('gulp');
var cssUserefAbs = require('gulp-css-useref-abs');

module.exports = gulp.task('ngn-copy-css-refs', function() {
  return gulp.src('build/public/m/css/*.css')
    .pipe(cssUserefAbs({
      absSources: {
        'i': '/home/masted/ngn-env/ngn'
      }
    }))
    .pipe(gulp.dest('build/public'));
});