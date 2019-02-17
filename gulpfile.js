const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();

const norm = [
	'./node_modules/normalize.css/normalize.css',
];

const sassFiles = [
	'./src/css/**/*.scss'
];

const jsFiles = [
	'./src/js/*.js'
];


// gulp.task('sass', function () {
// 	gulp.src('./sass/**/*.scss')
// 	  .pipe(sass().on('error', sass.logError))
// 	  .pipe(gulp.dest('./css'));
//   });


function styles(){
	return gulp.src(norm)
		.pipe(gulp.src(sassFiles))
		.pipe(sass())
		.pipe(concat('template.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({level: 2}))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}

function scripts(){
	return gulp.src(jsFiles)
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
}

function watch(){
	browserSync.init({
        server: {
            baseDir: "./"
		}
		//tunnel: true
    });
	gulp.watch('./src/css/**/*.scss', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./*.html').on('change', browserSync.reload);
}


function clean(){
	return del(['build/*'])
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);

/*сборка с очисткой папки build*/
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts))
					);

gulp.task('dev', gulp.series('build', 'watch'));
