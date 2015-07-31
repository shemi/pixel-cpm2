'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;



var rubySass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

var inlineCss = require('gulp-inline-css');
var inlineSource = require('gulp-inline-source');

var rename = require('gulp-rename');


gulp.task('styles', function() {
  return rubySass('app/styles/scss/main.scss', {
      sourcemap: false,
      style: 'expanded',
      lineNumbers: true
    })
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(reload({stream: true}));
});


gulp.task('inline', ['styles'], function() {
  return gulp.src('app/*.html')
    .pipe(inlineSource({
      rootpath: 'app'
    }))
    .pipe(inlineCss({
      preserveMediaQueries: true
    }))
    .pipe(gulp.dest('dist/'));
});



gulp.task('clean', require('del').bind(null, 'dist'));

gulp.task('build', ['clean','inline']);

gulp.task('serve', ['styles'], function() {
  browserSync({
    server: './app',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/*.html').on('change', reload);
  
});

gulp.task('serve:dist', ['inline'], function() {
  browserSync({
    server: './dist',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });
});
