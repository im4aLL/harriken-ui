const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const reload       = browserSync.reload;
const sass         = require('gulp-sass');
const webpack      = require('webpack-stream');
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
const cssnano      = require('gulp-cssnano');
const watch        = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');

let config = {
    sass: {
        source: './asset_sources/sass/style.scss',
        dist: './assets/css',
        fileName: 'style.css',
        minifiedFileName: 'style.min.css',
        watch: './asset_sources/sass/**/*.scss'
    },
    js: {
        source: './asset_sources/js/app.js',
        dist: './assets/js',
        fileName: 'app.js',
        minifiedFileName: 'app.min.js',
        watch: './asset_sources/js/**/*.js'
    },
    image: {
        source: './asset_sources/images/*',
        dist: './assets/images'
    },
    sync: {
        server: true
    }
};
// https://www.browsersync.io/docs/options/


// sass to css
gulp.task('sass', function () {
    gulp.src(config.sass.source)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.sass.dist))
        .pipe(browserSync.stream());
});

// browserify
gulp.task('js', function() {
    return gulp.src(config.js.source)
        .pipe(webpack({
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                }]
            },
            output: {
                filename: config.js.fileName,
            }
        }))
        .pipe(gulp.dest(config.js.dist))
        .pipe(browserSync.stream());
});

// default task and watch
gulp.task('watch', ['sass', 'js'], function() {
    browserSync.init(config.sync);

    watch(config.sass.watch, function(){
        gulp.start('sass');
    });

    watch(config.js.watch, function(){
        gulp.start('js');
    });

    watch(['./*.html', './**/*.php'], function(){
        reload();
    });
});

// default task
gulp.task('default', ['watch']);

// gulp build and minify things
gulp.task('production', ['sass', 'js'], function(){
    gulp.src(config.js.dist + '/' + config.js.fileName)
        .pipe(uglify())
        .pipe(rename(config.js.minifiedFileName))
        .pipe(gulp.dest(config.js.dist));

    gulp.src(config.sass.dist + '/' + config.sass.fileName)
        .pipe(cssnano())
        .pipe(rename(config.sass.minifiedFileName))
        .pipe(gulp.dest(config.sass.dist));
});
