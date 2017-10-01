'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var autoprefixerOptions = {
  browsers: ['last 4 versions', 'safari >= 5', 'ie 11', 'opera >= 12.1', 'ios >= 6', 'android >= 4']
};

gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('js', function () {
  return gulp.src('./js/**/*.js')
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('sass/**/*.scss',['sass']);
    gulp.watch('js/**/*.js',['js']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

var files = [
  './index.html',
  './css/**/*.*',
  './js/**/*.*',
  './fonts/**/*.*'
];

gulp.task('icons', function() { 
    return gulp.src('bower_components/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./fonts')); 
});

gulp.task('build', function() {
  return gulp.src(files , { base: './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browser-sync', 'icons'], function() { /**/ });
