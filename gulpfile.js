var gulp       = require('gulp');
var livereload = require('gulp-livereload');
var nodemon    = require('gulp-nodemon');

//=============================================================================
// TASKS
//=============================================================================

gulp.task('default', function(done) {
    livereload.listen();
    nodemon({
        ignore: [],
        script: 'index',
        ext: 'js',
        stdout: false
    }).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if(/^Express server listening on port/.test(chunk)){
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
    done();
});

