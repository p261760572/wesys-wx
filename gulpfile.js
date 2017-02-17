// var path = require('path');
// var fs = require('fs');
var gulp = require('gulp');
var config = require('./config.json');

var minimist = require('minimist');
var options = minimist(process.argv.slice(2));

gulp.task('copy', function() {
    gulp.src(config.copy.src).pipe(gulp.dest(config.copy.dest));
});

gulp.task('release', ['copy']);

gulp.task('watch', ['release'], function() {
    gulp.watch(config.copy.src, ['copy']);
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('default', ['release'], function() {

    if (options.s) {
        gulp.start('serve');
    }

    if (options.w) {
        gulp.start('watch');
    }
});
