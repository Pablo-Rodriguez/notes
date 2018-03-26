
const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify-es').default
const stylus = require('gulp-stylus')
const nib = require('nib')
const minifyHTML = require('gulp-htmlmin')

const staticDir = './backend/public/static'

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
    .pipe(gulp.dest(staticDir))
})

gulp.task('manifest', () => {
  return gulp.src('./manifest.json')
    .pipe(gulp.dest(staticDir))
})

gulp.task('stylus', () => {
  return gulp.src('./frontend/styles/*.styl')
    .pipe(stylus({
      compress: true,
      use: [nib()]
    }))
    .pipe(gulp.dest(staticDir))
})

gulp.task('js', () => {
  return browserifyOrigin('./frontend/js/index.js', 'bundle.js', staticDir)
})

gulp.task('service-worker', () => {
  return browserifyOrigin('./frontend/sw/index.js', 'sw.js', './backend/public/')
})

gulp.task('fonts', () => {
  return gulp.src('frontend/fonts/*')
    .pipe(gulp.dest(`${staticDir}/fonts`))
})

gulp.task('images', () => {
  return gulp.src('frontend/img/**/*')
    .pipe(gulp.dest(`${staticDir}/img`))
})

gulp.task('watch', () => {
  if (process.env.NODE_ENV !== 'production') {
    gulp.watch('frontend/index.html', ['html'])
    gulp.watch('./manifest.json', ['manifest'])
    gulp.watch('frontend/styles/**/*.styl', ['stylus'])
    gulp.watch('frontend/js/**/*.js', ['js'])
    gulp.watch('frontend/sw/*.js', ['service-worker'])
  }
})

gulp.task('default', ['html', 'manifest', 'fonts', 'images', 'stylus', 'js', 'service-worker', 'watch'])

