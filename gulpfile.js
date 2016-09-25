var pkg = require('./package.json');
var gulp = require('gulp');
var using = require('gulp-using');
var del = require('del');
var typescript = require('gulp-typescript');
var tslint = require("gulp-tslint");
var sourcemaps = require('gulp-sourcemaps');
// var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var KarmaServer = require('karma').Server;

var src_ts = 'src/**/*.ts';
var src_tsx = 'src/**/*.tsx';
var src_js = 'src/**/*.js';
var src_map = 'src/**/*.map';

var test_ts = 'test/**/*.ts';
var test_tsx = 'test/**/*.tsx';
var test_js = 'test/**/*.js';
var test_map = 'test/**/*.map';

var dest = 'dist/';
var dest_js = pkg.name + '.js';


gulp.task('default', ['tslint', 'build', 'dist']);

gulp.task('build', ['build:src', 'build:test']);

gulp.task("tslint", function () {
    return gulp.src([src_ts, src_tsx, test_ts, test_tsx])
        .pipe(using({prefix:'tslint -> ' + src_ts}))
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

gulp.task('build:src', function () {
    return gulp.src([src_ts, src_tsx])
        .pipe(using({prefix:'build src -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        // .pipe(babel())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/'));
});

gulp.task('build:test', function () {
    return gulp.src([test_ts, test_tsx])
        .pipe(using({prefix:'build test -> ' + test_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json', {
            noExternalResolve: false
        })))
        // .pipe(babel())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('test/'));
});

gulp.task('dist', ['dist:many', 'dist:many:d', 'dist:one', 'dist:one:d']);

gulp.task('dist:many', function () {
    return gulp.src([src_ts, src_tsx])
        .pipe(using({prefix:'dist:many -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json', {
            removeComments: true
        })))
        // .pipe(babel())
        .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest));
});

gulp.task('dist:many:d', function () {
    return gulp.src([src_ts, src_tsx])
        .pipe(using({prefix:'dist:many:d -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json', {
            declaration: true,
            removeComments: true
        })))
        .dts
        .pipe(gulp.dest(dest));
});

gulp.task('dist:one', function () {
    return gulp.src([src_ts, src_tsx])
        .pipe(using({prefix:'dist:one -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json', {
            removeComments: true,
            sortOutput: true
        })))
        .pipe(concat(dest_js))
        // .pipe(babel())
        .pipe(uglify().on('error', function (e) { console.log(e); }))
        .pipe(sourcemaps.write('./'))
        .pipe(using({prefix:'dist:one out -> ' + src_ts}))
        .pipe(gulp.dest(dest));
});

gulp.task('dist:one:d', function () {
    return gulp.src([src_ts, src_tsx])
        .pipe(using({prefix:'dist:one:d -> ' + src_ts}))
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json', {
            declaration: true,
            removeComments: true,
            outFile: dest_js
        })))
        .dts
        .pipe(gulp.dest(dest));
});

gulp.task('watch', function () {
    gulp.watch([src_ts, src_tsx, test_ts, test_tsx], ['build']);
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
        dest + '*'
    ]);
});

gulp.task('clean:all', ['clean'], function () {
    return del([
        'node_modules',
        'typings/*/',
        '.tscache/'
    ]);
});
