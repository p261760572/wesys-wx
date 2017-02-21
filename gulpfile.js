// var path = require('path');
// var fs = require('fs');
var gulp = require('gulp');
var config = require('./config.json');

var minimist = require('minimist');
var options = minimist(process.argv.slice(2));

gulp.task('copy', function() {
    var dest = config.copy.dest;
    if(!Array.isArray(dest)) {
        dest = [dest];
    }
    
    dest.forEach(function (currentValue) {
        gulp.src(config.copy.src).pipe(gulp.dest(currentValue));
    });
    
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
