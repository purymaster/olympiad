// GULP 및 각종 모듈 호출
const gulp = require("gulp"),
	sync = require("browser-sync").create(),
	include = require("gulp-file-include"),
	concat = require("gulp-concat"),
	prefix = require("gulp-autoprefixer"),
	pretty = require("gulp-pretty-html"),
	beautify = require("gulp-beautify");

// 경로 설정
const src_path = {
	js: "src/js/*.js",
	css: "src/css/*.css",
	html: "src/**/*.html",
	img: "src/img/**/*.+(jpg|png|gif)",
	include: "src/inc/"
},
	dev_path = {
		base: "dev",
		js: "dev/js/",
		css: "dev/css/",
		img: "dev/img/"
	};

// HTML 작업(include, pretty)
gulp.task("html", function () {
	gulp.src(src_path.html)
		.pipe(include({
			prefix: "@@",
			basepath: src_path.include
		}))
		.pipe(pretty({
			indent_with_tabs: true
		}))
		.pipe(gulp.dest(dev_path.base))
		.pipe(
			sync.reload({
				stream: true
			})
		);
});

// 이미지 작업
gulp.task("img", function () {
	gulp.src(src_path.img)
		.pipe(gulp.dest(dev_path.img))
		.pipe(
			sync.reload({
				stream: true
			})
		);
});

// CSS 작업(concat, comb)
gulp.task("css", function () {
	gulp.src(src_path.css)
		// .pipe(plumber({
		// 	errorHandler: function (err) {
		// 		console.log(color('\nCSS 문법 에러 : ' + err + '\n', 'RED'));
		// 		this.emit('end');
		// 	}
		// }))
		.pipe(concat("template.css"))
		.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(dev_path.css))
		.pipe(
			sync.reload({
				stream: true
			})
		);
});

// JS 작업(beautify, jslint)
gulp.task("js", function () {
	gulp.src(src_path.js)
		.pipe(beautify())
		.pipe(
			sync.reload({
				stream: true
			})
		);
});

// 브라우저 싱크
gulp.task("sync", ["html"], function () {
	sync.init({
		port: 8080,
		server: {
			baseDir: "./",
			index: "map_list.html"
		},
		browser: ["google chrome"]
		// browser: ["google chrome", "firefox", "iexplore", "opera", "safari"]
	});
});

// 파일 변경 감지
gulp.task("watch", function () {
	gulp.watch([src_path.html, src_path.include], ["html"]);
	gulp.watch(src_path.css, ["css"]);
	gulp.watch(src_path.js, ["js"]);
	gulp.watch(src_path.img, ["img"]);
});

// 기본 수행 작업
gulp.task("default", ["sync", "watch"]);