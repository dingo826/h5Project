const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const sourceMap = require('gulp-sourcemaps');

const clean = require('gulp-clean');
const sequence = require('gulp-sequence');

const contentIncluder = require('gulp-content-includer');

const basePath = path.resolve(__dirname, 'src');//-项目路径 ../src/
const outPath = path.resolve(__dirname, 'htmldist');//- 代码输出路径
console.log("项目文件base目录：" + basePath);
console.log("项目文件base目录：" + outPath);
// clean dist文件
gulp.task('clean', function () {
    return gulp.src([
    	outPath + '/favicon.ico',
        outPath + '/assets/**/*.{js,css}',
        outPath + '/js/**/*.js',
        outPath + '/images/**/*.*',
        outPath + '/*.html',
        outPath + '/style/**/*.*'
	], {read: false})
    .pipe(clean({force: true}));
})
gulp.task('concat',function() {
    gulp.src(basePath + '/*.html')
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest(outPath))
});
// 跑静态服务器
gulp.task("server",function(){
	//静态服务器
    browserSync.init({
        server: {
            baseDir: outPath,
            port: 3000
        }
    });
});
// 生成map，less转为css，css压缩，输出
gulp.task('less', function () {
    gulp.src('less/index.less')
    	.pipe(sourceMap.init())
        .pipe(less())
        .pipe(sourceMap.write())
        .pipe(cssmin())
        .pipe(gulp.dest('style'));
});
// 监听到less变化后，执行less
gulp.task('dev-watch', function () { //观察变动  将less跑起来
	gulp.watch(basePath+'/less/**/*.less', ['less']);
    gulp.watch(basePath+'/**/*.html', ['concat']);
});
// 将 src 移动到 dist 生成 静态页面 
gulp.task('move',  function() {
  return gulp.src([
        basePath + '/favicon.ico',
        basePath + '/assets/**/*.{js,css}',
        basePath + '/js/**/*.js',
        basePath + '/images/**/*.*',
        basePath + '/style/**/*.*'
    ], {base: basePath})
    .pipe(gulp.dest(outPath))
});
// 静态页面 开发环境  include   link  js引入 将include 对应的js/link对应的js（列表什么通过传对应标识参数） 
// html是单独页面 link 引入进去 渲染成script模式
// html 如果是组件的话，直接放入到页面dom容器中
// 生成对应的js文件  
// png 图 雪碧图
gulp.task("dev", function (cb) {
    sequence('clean', 'concat', 'less', 'move', 'server',  'dev-watch', cb);
});
// 发布静态页面——为了预览
gulp.task("htmlpro", function (cb) {
    sequence('clean', 'less', 'move', cb);
});

