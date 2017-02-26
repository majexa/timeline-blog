var gulp = require('gulp');

module.exports = gulp.task('copy-m', function() {
  gulp.src('./m/**/*')
    .pipe(gulp.dest('./build/public/m'));
});
