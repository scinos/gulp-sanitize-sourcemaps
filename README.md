# gulp-sanitize-sourcemaps

Gulp task used to clean up generated sourcemaps.

# Usage

```
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const sanitize = require('gulp-sanitize-sourcemaps');

gulp.task('default', () => {
    return gulp.src('source.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(sanitize())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('test'));
});
```


It will clean up the sourcemap and make sure that there are not duplicated mappings.