var gulp = require('gulp'),
    watch = require('gulp-watch');

gulp.task('default', function(){
    
});

gulp.watch('./**/*.js', function() {
    gulp.run('js');
});