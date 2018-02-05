
'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pump = require('pump');
const gutil = require('gulp-util');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

const envoriment  = {
	nodemodules: './node_modules/',
	pathDev: './dev',
	pathAssetsScss: 'assets/scss/'
}

gulp.task('js', function () {
	return gulp.src(`${envoriment.pathDev}/assets/js/*.js`)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(babel({
			presets: ['env']
		}))

		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(gulp.dest(`./dist/assets/js/`))
});

gulp.task('css',['vendor'] ,function () {
	var plugins = [
		autoprefixer({ browsers: ['last 3 versions', '> 1%', 'ie 9', 'Firefox ESR', 'iOS 7'] }),
		cssnano({ zindex: false }),
	];

	return gulp.src(`${envoriment.pathDev}/${envoriment.pathAssetsScss}*.scss`)
		.on('error', sass.logError)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(`./dist/assets/css/`));
});

gulp.task('vendor', function () {
	return gulp.src(`./node_modules/animate.css/animate.min.css`)
		.pipe(gulp.dest(`./dist/assets/css/`));

})
gulp.task('copy:html', function () {
	gulp.src('./dev/*.html')
	.pipe(gulp.dest('./dist'));

});

gulp.task('image', () =>
	gulp.src(`${envoriment.pathDev}/assets/img/**/*`)
		.pipe(imagemin())
		.pipe(gulp.dest(`./dist/assets/img/`))
);

gulp.task('watch', function () {
	gulp.watch(`${envoriment.pathDev}/assets/scss/*.scss`, ['css'])
	gulp.watch(`${envoriment.pathDev}/assets/js/*.js`, ['js'])
	gulp.watch(`${envoriment.pathDev}/assets/img/**/*.*`, ['image'])
});

gulp.task('serve',['css','image','js','watch'], function() {

		browserSync.init({
			server: "./dist",
		}
	);
	gulp.watch(`./dist/assets/css/*.css`).on('change', browserSync.reload);
	gulp.watch(`./dist/assets/js/*.js`).on('change', browserSync.reload);
	gulp.watch(`./dist/assets/img/**/*`).on('change', browserSync.reload);
    gulp.watch("./dist/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
