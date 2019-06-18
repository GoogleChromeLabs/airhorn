import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import {
  rollup
} from 'rollup';
import {
  terser
} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

const $ = gulpLoadPlugins();

// Optimize images
const images = () =>
  gulp.src('app/images/**/*')
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest('dist/images'))
      .pipe($.size({
        title: 'images'
      }));

const sounds = () =>
  gulp.src('app/sounds/**/*')
      .pipe(gulp.dest('dist/sounds'))
      .pipe($.size({
        title: 'sounds'
      }));

const wellknown = () =>
  gulp.src('app/.well-known/**/*')
      .pipe(gulp.dest('dist/.well-known'))
      .pipe($.size({
        title: 'wellknown'
      }));

const scripts = () =>
  gulp.src('app/scripts/**/*')
      .pipe(gulp.dest('dist/scripts'))
      .pipe($.size({
        title: 'scripts'
      }));

// Copy all files at the root level (app)
const copy = () =>
  gulp.src(['app/*', '!app/*.html'], {
    dot: true
  }).pipe(gulp.dest('dist'))
      .pipe($.size({
        title: 'copy'
      }));

// Compile and automatically prefix stylesheets
const styles = () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/**/*.css'
  ])
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(gulp.dest('.tmp/styles'))
      .pipe($.concat('main.css'))
      .pipe($.cssnano())
      .pipe($.size({
        title: 'styles'
      }))
      .pipe(gulp.dest('dist/styles'));
};

// Scan your HTML for assets & optimize them
const html = () => {
  return gulp.src('app/**/*.html')
      .pipe($.useref({
        searchPath: '{.tmp,app}',
        noAssets: true
      }))
      .pipe($.if('*.html', $.htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeOptionalTags: true
      })))
  // Output files
      .pipe($.if('*.html', $.size({
        title: 'html',
        showFiles: true
      })))
      .pipe(gulp.dest('dist'));
};

const clean = (done) => {
  return del(['.tmp', 'dist/*', '!dist/.git'], {
    dot: true
  }, done);
};

const client = (done) => {
  return rollup({
    input: './app/scripts/main.min.js',
    plugins: [
      babel({
        babelrc: false,
        presets: [
          ['@babel/env', {
            'targets': {
              'chrome': '41'
            }
          }]
        ],
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }).then(bundle => {
    return bundle.write({
      file: './dist/scripts/main.min.js',
      format: 'iife'
    });
  });
};

const build = gulp.series(clean, copy, scripts, gulp.parallel(client, styles, sounds, wellknown, html, images));

gulp.task('default', build);
gulp.task('clean', clean);

