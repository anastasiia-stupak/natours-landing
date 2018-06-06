const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');
const rimraf = require('rimraf');


// ------- Server ---------
// turn off before production on HEROKU

gulp.task('server', function () {
	browserSync.init({
		server: {
			port: 9000,
			baseDir: "build/"
		}
	});

	gulp.watch('build/**/*').on('change', browserSync.reload);
});

// ------- Sass Compile ---------

gulp.task('styles:compile', function () {
	return gulp.src('src/sass/main.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 4 version', '> 5%']}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/css'))

});

// ------- Clean ---------

gulp.task('clean', function (cb) {
	return rimraf('build', cb)
});

// ------- Copy Images ---------

gulp.task('copy:images', function () {
	return gulp
		.src('src/img/**/*.*')
		.pipe(gulp.dest('build/img'));
});

// ------- Copy Fonts ---------

gulp.task('copy:fonts', function () {
	return gulp
		.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

// ------- Copy Template ---------

gulp.task('copy:template', function () {
	return gulp
		.src('src/index.html')
		.pipe(gulp.dest('build'));
});

// ------- Copy Both ---------

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:template'));


// ------------ Watchers -----------
// turn off before production on HEROKU

gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.scss', gulp.series('styles:compile'));
	gulp.watch('src/index.html', gulp.series('copy:template'));
});

// ------------ Default -----------

// turn off gulp.parallel('watch', 'server')
// before production on HEROKU

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('styles:compile', 'copy'),
	gulp.parallel('watch', 'server')
));