var pkg = require('./package.json');
var gulp = require('gulp');
var all = require('gulp-all');
var using = require('gulp-using');
var del = require('del');
var typescript = require('gulp-typescript');
// var babel = require('gulp-babel');
var jsx = require('gulp-nativejsx');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var KarmaServer = require('karma').Server;

var src_ts = 'src/**/*.ts';
var src_tsx = 'src/**/*.tsx';
var src_js = 'src/**/*.js';
var src_map = 'src/**/*.map';
var src_jsx = 'src/**/*.jsx';

var test_ts = 'test/**/*.ts';
var test_tsx = 'test/**/*.tsx';
var test_js = 'test/**/*.js';
var test_map = 'test/**/*.map';
var test_jsx = 'test/**/*.jsx';

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
        gulp.src(src_tsx)
            .pipe(using({prefix:'build -> ' + src_tsx}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(jsx())
            // .pipe(babel())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('src/')),
        gulp.src(test_ts)
            .pipe(using({prefix:'build -> ' + test_ts}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('test/')),
        gulp.src(test_tsx)
            .pipe(using({prefix:'build -> ' + test_tsx}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(jsx())
            // .pipe(babel())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('test/'))
    );
});

gulp.task('dist', ['dist:many', 'dist:one']);

gulp.task('dist:many', ['build'], function () {
    return all(
        gulp.src(src_ts)
            .pipe(using({prefix:'dist:many -> ' + src_ts}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/')),
        gulp.src(src_tsx)
            .pipe(using({prefix:'dist:many -> ' + src_tsx}))
            .pipe(sourcemaps.init())
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .pipe(jsx())
            // .pipe(babel())
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/')),
        gulp.src([src_ts, src_tsx])
            .pipe(using({prefix:'dist:many -> ' + src_ts + ', ' + src_tsx}))
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .dts
            .pipe(gulp.dest('dist/'))
    );
});

gulp.task('dist:one', ['build'], function () {
    return all(
        gulp.src([src_js])
            .pipe(using({prefix:'dist:one -> ' + src_js}))
            .pipe(sourcemaps.init())
            .pipe(concat(pkg.name + '.js'))
            // .pipe(gulp.dest('dist/'))
            // .pipe(gp_rename(pkg.name + '.min.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/')),
        gulp.src([src_ts, src_tsx])
            .pipe(using({prefix:'dist:one -> ' + src_ts + ', ' + src_tsx}))
            .pipe(typescript(typescript.createProject('tsconfig.json')))
            .dts
            .pipe(concat(pkg.name + '.d.ts'))
            .pipe(gulp.dest('dist/'))
    );
});

gulp.task('watch', function () {
    gulp.watch([
            src_ts, src_tsx,
            test_ts, test_tsx],
        ['build']);
});

gulp.task('test', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('clean', function () {
    return del([
        'node_modules',
        src_js,
        src_map,
        src_jsx,
        test_js,
        test_map,
        test_jsx,
        'dist/*'
    ]);
});
