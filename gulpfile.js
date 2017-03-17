// var path = require('path');
// var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var config = require('./config.json');

var minimist = require('minimist');
var options = minimist(process.argv.slice(2));

gulp.task('copy', function() {
    var dest = config.copy.dest;
    if (!Array.isArray(dest)) {
        dest = [dest];
    }

    var stream = gulp.src(config.copy.src);

    dest.forEach(function(currentValue) {
        stream = stream.pipe(gulp.dest(currentValue));
    });

    return stream;
});

gulp.task('build:zepto', ['copy'], function() {
    return gulp.src(config.zepto.src)
        //require
        // .pipe(tap(js_require))
        //输出
        //.pipe(gulp.dest(config.zepto.dest))
        //合并
        .pipe(concat('zepto.js'))
        //未压缩
        .pipe(gulp.dest(config.zepto.dest))
        //压缩
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(config.zepto.dest));
});

gulp.task('release', ['copy', 'build:zepto']);

gulp.task('watch', ['release'], function() {
    gulp.watch(config.copy.src, ['copy', 'build:zepto']);
    gulp.watch(config.zepto.src, ['build:zepto']);
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
