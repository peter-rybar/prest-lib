var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var typescript = require('gulp-typescript');
var jsx = require('gulp-nativejsx');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


gulp.task('default', ['dist:test', 'dist:src', 'dist:all']);

gulp.task('dist:test', function () {
    gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/'));
    gulp.src('src/**/*.tsx')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(jsx())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('src/'));
    gulp.src('test/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('test/'));
    gulp.src('test/**/*.tsx')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(jsx())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('test/'));
});

gulp.task('dist:src', function () {
    gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));
    gulp.src('src/**/*.tsx')
        .pipe(sourcemaps.init())
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .pipe(jsx())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));
    gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .dts
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist:all', function () {
    gulp.src(['src/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('prest.js'))
        // .pipe(gulp.dest('dist/'))
        // .pipe(gp_rename('prest.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));
    gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(typescript(typescript.createProject('tsconfig.json')))
        .dts
        .pipe(concat('prest.d.ts'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch([
        'src/**/*.ts', 'src/**/*.tsx',
        'test/**/*.ts', 'test/**/*.tsx'],
        ['dist:test']);
});

gulp.task('clean', function () {
    del([
        'node_modules',
        'src/**/*.js',
        'src/**/*.map',
        'src/**/*.jsx',
        'test/**/*.js',
        'test/**/*.map',
        'test/**/*.jsx',
        'dist/*'
    ]);
});
