var pkg = require('./package.json');
var gulp = require('gulp');
var all = require('gulp-all');
var using = require('gulp-using');
var del = require('del');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var merge = require('merge2');
var KarmaServer = require('karma').Server;

var src_ts = 'src/**/*.ts';
var src_js = 'src/**/*.js';
var src_map = 'src/**/*.map';

var test_ts = 'test/**/*.ts';
var test_js = 'test/**/*.js';
var test_map = 'test/**/*.map';

// gulp.task('default', ['build', 'dist:many', 'dist:one', 'test']);
gulp.task('default', ['build', 'dist']);

gulp.task('build', function () {
    return all(
        gulp.src(src_ts)
            .pipe(using({prefix:'build -> ' + src_ts}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('src/')),
        gulp.src(test_ts)
            .pipe(using({prefix:'build -> ' + test_ts}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('test/'))
    );
});

gulp.task('dist', ['dist:many', 'dist:one']);

gulp.task('dist:many', function () {
    var tsResult = gulp.src(src_ts)
        .pipe(using({prefix:'dist:many -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript({
            declaration: true,
            target: 'es5',
            noImplicitAny: false,
            removeComments: true,
            noExternalResolve: true
        }));
    return merge([
        tsResult.dts
            .pipe(gulp.dest('dist/')),
        tsResult.js
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/'))
    ]);
});

gulp.task('dist:one', function () {
    var tsResult = gulp.src(src_ts)
        .pipe(using({prefix:'dist:many -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript({
            declaration: true,
            target: 'es5',
            noImplicitAny: false,
            removeComments: true,
            noExternalResolve: true,
            outFile: pkg.name + '.js'
        }));
    return merge([
        tsResult.dts
            .pipe(gulp.dest('dist/')),
        tsResult.js
            .pipe(uglify().on('error', function (e) { console.log(e); }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/'))
    ]);
});

gulp.task('watch', function () {
    gulp.watch([src_ts, test_ts], ['build']);
});

gulp.task('test', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('clean', function () {
    return del([
        src_js,
        src_map,
        test_js,
        test_map,
        'dist/*'
    ]);
});

gulp.task('clean:all', ['clean'], function () {
    return del([
        'node_modules'
    ]);
});
