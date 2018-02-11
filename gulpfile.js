
const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify-es').default
const stylus = require('gulp-stylus')
const nib = require('nib')
const minifyHTML = require('gulp-htmlmin')

function browserifyOrigin (entries, name, output) {
  let base = browserify({
    entries: entries
  })
    .transform('babelify')
    .bundle()
    .pipe(source(name))
    .pipe(buffer())
  base = process.env.NODE_ENV !== 'production' ? base
    : base.pipe(uglify({compress: true}))
  return base
    .pipe(gulp.dest(output))
}

gulp.task('html', () => {
  return gulp.src('./frontend/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./backend/public/'))
})

gulp.task('stylus', () => {
  return gulp.src('./frontend/styles/*.styl')
    .pipe(stylus({
      compress: true,
      use: [nib()]
    }))
    .pipe(gulp.dest('./backend/public/'))
})

gulp.task('js', () => {
  return browserifyOrigin('./frontend/js/index.js', 'bundle.js', './backend/public/')
})

gulp.task('fonts', () => {
  return gulp.src('frontend/fonts/*')
    .pipe(gulp.dest('backend/public/fonts'))
})

gulp.task('images', () => {
  return gulp.src('frontend/img/**/*')
    .pipe(gulp.dest('backend/public/img'))
})

gulp.task('watch', () => {
  if (process.env.NODE_ENV !== 'production') {
    gulp.watch('frontend/index.html', ['html'])
    gulp.watch('frontend/styles/**/*.styl', ['stylus'])
    gulp.watch('frontend/js/**/*.js', ['js'])
  }
})

gulp.task('default', ['html', 'fonts', 'images', 'stylus', 'js', 'watch'])
