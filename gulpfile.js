var gulp = require('gulp');

var assetsDev = 'public/assetsDev';
var assetsProd = 'public/assetsProd';

var appDev = 'client/dev';
var appProd = 'client/prod';

/* Mixed */
var ext_replace = require('gulp-ext-replace');

/* CSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

/* Images */
var imagemin = require('gulp-imagemin');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build-css', function () {
    Console.log("1");
    return gulp.src(assetsDev + 'scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss([precss, autoprefixer, cssnano]))
        .pipe(sourcemaps.write())
        .pipe(ext_replace('.css'))
        .pipe(gulp.dest(assetsProd + 'css/'));
});

gulp.task('build-ts', function () {
    Console.log("2");
    return gulp.src(appDev + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        //.pipe(jsuglify())
        .pipe(gulp.dest(appProd));
});

gulp.task('build-img', function () {
    Console.log("3");
    return gulp.src(assetsDev + 'img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(assetsProd + 'img/'));
});

gulp.task('build-html', function () {
    Console.log("4");
    return gulp.src(appDev + '**/*.html')
        .pipe(gulp.dest(appProd));
});

gulp.task('watch', function () {
    Console.log("5");
    gulp.watch(appDev + '**/*.ts', ['build-ts']);
    gulp.watch(assetsDev + 'scss/**/*.scss', ['build-css']);
    gulp.watch(assetsDev + 'img/*', ['build-img']);
});

gulp.task('default', ['watch']);