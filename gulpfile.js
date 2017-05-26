// REQUIRES
///////////////////////////////////////////////

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del');

// PATHS
///////////////////////////////////////////////

var paths = {
    html:['app/*.html'],
    scss:['app/scss/*.scss'],
    csssrc: ['app/css/*.css'],
    css: 'app/css/',
    basedir: 'app/'
};

var build = {
    html: 'dist/',
    css: 'dist/css/', 
    basedir: 'dist'
};

// LOCAL TASKS
///////////////////////////////////////////////

// reload server
gulp.task('sync', function() {
    browserSync({
        server: {
            baseDir: paths.basedir            
        },
        port: 8080,
        open: true,
        notify: false
    });
});

// html reload
gulp.task('html', function(){
    gulp.src(paths.html)
    .pipe(browserSync.reload({
        stream: true
    }));
});

// sass
gulp.task('sass', function() {
    return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({
        stream: true
    }))
});

// WATCHER
///////////////////////////////////////////////

gulp.task('watch', ['sync', 'html', 'sass'], function() {
    gulp.watch(paths.scss, ['sass']); 
    gulp.watch(paths.html, ['html']);
});

// BUILDS
///////////////////////////////////////////////

// build css
gulp.task('build:css', function() {
    return gulp.src(paths.csssrc)
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
    }))
    .pipe(cleanCSS({
        compatibility: 'ie8'
    }))
    .pipe(gulp.dest(build.css));
});

// build html
gulp.task('build:html', function() {
    return gulp.src(paths.html)
    .pipe(gulp.dest(build.html));
});

// clean project
gulp.task('clean', function() {
    console.log('Clean all files in dist folder');
    return del.sync(build.basedir);
});

// build project
gulp.task('build', ['clean', 'build:html', 'build:css']);