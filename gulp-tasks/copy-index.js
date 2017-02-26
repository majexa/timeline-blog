var gulp = require('gulp');

module.exports = gulp.task('copy-index', function() {
  gulp.src('./index.html')
    .pipe(gulp.dest('./build/public'));
});
