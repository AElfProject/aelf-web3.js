#!/usr/bin/env node

// 'use strict';
//
// var path = require('path');
//
// var gulp = require('gulp');
// var browserify = require('browserify');
// var jshint = require('gulp-jshint');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var source = require('vinyl-source-stream');
// var exorcist = require('exorcist');
// var streamify = require('gulp-streamify');

'use strict';

var path = require('path');

// var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
// var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
// var bower = require('bower');
var streamify = require('gulp-streamify');
// var replace = require('gulp-replace');

var DEST = path.join(__dirname, 'dist/');
var src = './lib/aelf';
var lightDst = 'aelf-sdk-light';

var browserifyOptions = {
    debug: true,
    insert_global_vars: false, // jshint ignore:line
    detectGlobals: true,
    bundleExternal: true
};
//
// gulp.task('lint', [], function(){
//     return gulp.src(['./*.js', './lib/*.js'])
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });
//
// gulp.task('clean', ['lint'], function(cb) {
//     del([ DEST ]).then(cb.bind(null, null));
// });

gulp.task('light', [], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'aelf-sdk'})
        // .ignore('bignumber.js')
        // .ignore('xmlhttprequest')
        // .require('./lib/utils/browser-bn.js', {expose: 'bignumber.js'}) // fake bignumber.js
        .add('./' + src + '.js')
        .bundle()
        .pipe(exorcist(path.join( DEST, lightDst + '.js.map')))
        .pipe(source(lightDst + '.js'))
        .pipe(gulp.dest( DEST ));
        // .pipe(streamify(uglify()))
        // .pipe(rename(lightDst + '.min.js'))
        // .pipe(gulp.dest( DEST ));
});


gulp.task('watch', function() {
    gulp.watch(['./lib/*.js'], ['lint', 'build']);
});

gulp.task('default', ['light']);