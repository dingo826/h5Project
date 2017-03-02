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

const htmlBasePath = path.resolve(__dirname, 'src');//-项目路径 ../src/
const basePath = path.resolve(__dirname, 'src');
const outPath = path.resolve(__dirname, 'dist');//- 代码输出路径
console.log("项目文件base目录：" + htmlBasePath);
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
            baseDir: htmlBasePath,
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
});
// 将 src 移动到 dist 生成 静态页面 
gulp.task('move',  function() {
  return gulp.src([
        basePath + '/favicon.ico',
        basePath + '/assets/**/*.{js,css}',
        basePath + '/js/**/*.js',
        basePath + '/images/**/*.*',
        basePath + '/*.html',
        basePath + '/style/**/*.*'
    ], {base: basePath})
    .pipe(gulp.dest(outPath))
});
// 静态页面 开发环境  include   link  js引入 将include 对应的js/link对应的js（列表什么通过传对应标识参数） 
// html是单独页面 link 引入进去 渲染成script模式
// html 如果是组件的话，直接放入到页面dom容器中
// 生成对应的js文件  
// png 图 雪碧图
gulp.task("htmldev", function (cb) {
    sequence('server', 'dev-watch', cb);
});
// 发布静态页面——为了预览
gulp.task("htmlpro", function (cb) {
    sequence('clean', 'less', 'move', cb);
});

// 发布静态页面——为了开发  
// 将htmldev的代码复制到对应文件夹，并跑起来，数据对接块内容 复制到对应的文件目录 clean的时候 这个文件目录还没考虑好怎么处理
gulp.task("ajaxdev", function (cb) {
    sequence('clean', 'less', 'move', cb);
});

// 发布最终版本  版本号 js压缩  
gulp.task("ajaxpro", function (cb) {
    sequence('clean', 'less', 'move', cb);
});

// 性能优化  js测试 css测试  找对应的岗位去更新找