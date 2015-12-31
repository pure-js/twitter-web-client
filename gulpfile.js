var gulp = require('gulp'),
  fs = require('fs'),
  replace = require('gulp-replace'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  plumber = require('gulp-plumber'),
  htmlmin = require('gulp-htmlmin'),
  nano = require('gulp-cssnano'),
  spritesmith = require('gulp.spritesmith'),
  ghPages = require('gulp-gh-pages'),
  merge = require('merge-stream');

var paths = {
  jade: 'index.jade',
  jadeWatch: [
    'blocks/**/*.jade',
    'index.jade'
  ],
  stylus: [
    'stylesheets/main.styl',
    'stylesheets/above-the-fold.styl'
  ],
  stylusWatch: [
    'blocks/**/*.styl',
    'stylesheets/main.styl'
  ],
  images: 'img/**/*.{png,jpg}',
  css: 'bower_components/normalize.css/normalize.css',
  js: 'js/**/*.js',
  build: 'build/',
  dist: 'dist/'
};

// Get one .styl file and render
gulp.task('css', function() {
  return gulp.src(paths.stylus)
    .pipe(plumber())
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest(paths.build + 'css/'));
});

gulp.task('html', function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify-css', function() {
  return gulp.src(paths.stylus)
    .pipe(plumber())
    .pipe(stylus({
      'include css': true
    }))
    .pipe(nano())
    .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('minify-html', ['minify-css'], function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade())
    // Css from file to inline
    .pipe(replace(/<link href="above-the-fold.css" rel="stylesheet">/, function(s) {
      var style = fs.readFileSync('dist/css/above-the-fold.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy', ['copy-images', 'copy-js']);

gulp.task('copy-images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.build + 'img/'));
});

gulp.task('copy-js', function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.build + 'js/'));
});

gulp.task('copy-to-dist', ['copy-images-to-dist', 'copy-js-to-dist']);

gulp.task('copy-images-to-dist', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.dist + 'img/'));
});

gulp.task('copy-js-to-dist', function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('img/previews/*.jpg')
    .pipe(spritesmith({
      imgName: '../img/sprites/sprite.png',
      cssName: 'sprite.styl'
    }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(gulp.dest('./sprites/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    // .pipe(csso())
    .pipe(gulp.dest('stylesheets/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.stylusWatch, ['css']);
  gulp.watch(paths.jadeWatch, ['html']);
  gulp.watch(paths.js, ['copy-js']);
});

gulp.task('deploy', ['dist'], function() {
  return gulp.src(paths.dist + '**/*')
    .pipe(ghPages());
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['html', 'css', 'watch', 'copy']);
gulp.task('dist', ['minify-html', 'minify-css', 'copy-to-dist', 'sprite']);
gulp.task('default', ['build']);
