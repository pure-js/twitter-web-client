const gulp = require('gulp'),
  fs = require('fs'),
  replace = require('gulp-replace'),
  pug = require('gulp-pug'),
  stylus = require('gulp-stylus'),
  plumber = require('gulp-plumber'),
  htmlmin = require('gulp-htmlmin'),
  cleanCSS = require('gulp-clean-css'),
  spritesmith = require('gulp.spritesmith'),
  ghPages = require('gulp-gh-pages'),
  merge = require('merge-stream');

const paths = {
  pug: 'src/index.pug',
  pugWatch: ['src/index.pug'],
  stylus: ['src/css/main.styl', 'src/css/above-the-fold.styl'],
  stylusWatch: ['src/blocks/**/*.styl', 'src/css/main.styl'],
  images: 'assets/img/**/*.{png,jpg}',
  css: 'node_modules/normalize.css/normalize.css',
  js: 'src/js/*.js',
  build: 'build/',
  dist: 'dist/',
};

// Get one .styl file and render
gulp.task('css', function () {
  return gulp
    .src(paths.stylus)
    .pipe(plumber())
    .pipe(
      stylus({
        'include css': true,
      }),
    )
    .pipe(gulp.dest(paths.build + 'css/'));
});

gulp.task('html', function () {
  return gulp
    .src(paths.pug)
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify-css', function () {
  return gulp
    .src(paths.stylus)
    .pipe(plumber())
    .pipe(
      stylus({
        'include css': true,
      }),
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('minify-html', ['minify-css'], function () {
  return (
    gulp
      .src(paths.pug)
      .pipe(plumber())
      .pipe(pug())
      // Css from file to inline
      .pipe(
        replace(
          /<link href="above-the-fold.css" rel="stylesheet">/,
          function (s) {
            let style = fs.readFileSync('dist/css/above-the-fold.css', 'utf8');
            return '<style>\n' + style + '\n</style>';
          },
        ),
      )
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(paths.dist))
  );
});

gulp.task('copy', ['copy-images', 'copy-js']);

gulp.task('copy-images', function () {
  return gulp.src(paths.images).pipe(gulp.dest(paths.build + 'img/'));
});

gulp.task('copy-js', function () {
  return gulp.src(paths.js).pipe(gulp.dest(paths.build + 'js/'));
});

gulp.task('copy-to-dist', ['copy-images-to-dist', 'copy-js-to-dist']);

gulp.task('copy-images-to-dist', function () {
  return gulp.src(paths.images).pipe(gulp.dest(paths.dist + 'img/'));
});

gulp.task('copy-js-to-dist', function () {
  return gulp.src(paths.js).pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('sprite', function () {
  // Generate our spritesheet
  let spriteData = gulp.src('img/previews/*.jpg').pipe(
    spritesmith({
      imgName: '../img/sprites/sprite.png',
      cssName: 'sprite.styl',
    }),
  );

  // Pipe image stream through image optimizer and onto disk
  let imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(gulp.dest('./sprites/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  let cssStream = spriteData.css
    // .pipe(csso())
    .pipe(gulp.dest('stylesheets/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.stylusWatch, ['css']);
  gulp.watch(paths.pugWatch, ['html']);
  gulp.watch(paths.js, ['copy-js']);
});

gulp.task('deploy', ['dist'], function () {
  return gulp.src(paths.dist + '**/*').pipe(ghPages());
});

// The default task (called when you run `gulp` from cli)
gulp.task('dev', ['html', 'css', 'watch', 'copy']);
gulp.task('dist', ['minify-html', 'minify-css', 'copy-to-dist', 'sprite']);
gulp.task('default', ['dev']);
