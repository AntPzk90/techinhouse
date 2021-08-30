//Подключаем галп
const gulp = require("gulp");
//Объединение файлов
const concat = require("gulp-concat");
//Добапвление префиксов
const autoprefixer = require("gulp-autoprefixer");
//sprite
var svgSprite = require("gulp-svg-sprite");
var cheerio = require("gulp-cheerio");
var svgmin = require("gulp-svgmin");
var replace = require("gulp-replace");
var fileinclude = require("gulp-file-include");
// const svgsprite = require("gulp-svgstore");
// //rename
// const rename = require("gulp-rename");
//Оптисизация стилей
const cleanCSS = require("gulp-clean-css");
// Формат написания стилей
const csscomb = require("gulp-csscomb");
//Оптимизация скриптов
const uglify = require("gulp-uglify-es").default;
//Удаление файлов
const del = require("del");
//Синхронизация с браузером
const browserSync = require("browser-sync").create();
//Для препроцессоров стилей
const sourcemaps = require("gulp-sourcemaps");
// обработчик ошибок
var plumber = require("gulp-plumber");
//минифик изобр
var imagemin = require("gulp-image");
// Минификация HTML
const htmlmin = require("gulp-htmlmin");
// var pug = require("gulp-pug");
//Less препроцессор
const less = require("gulp-less");
// //Stylus препроцессор
// const stylus = require('gulp-stylus');
// //Sass препроцессор
// const sass = require('gulp-sass');

//Порядок подключения файлов со стилями
const styleFiles = ["./src/less/main.less"];
//Порядок подключения js файлов
const scriptFiles = [
  "./src/js/jquery-3.5.1.min.js",
  "./src/slick-1.8.1/slick/slick.min.js",
  "./src/js/script.js",
];

//Таск для обработки стилей
gulp.task("styles", () => {
  //Шаблон для поиска файлов CSS
  //Всей файлы по шаблону './src/css/**/*.css'
  return (
    gulp
      .src(styleFiles)
      .pipe(sourcemaps.init())
      // обработчик ошибок
      .pipe(plumber())
      //Указать stylus() , sass() или less()
      .pipe(less())
      //Объединение файлов в один
      .pipe(concat("style.css"))
      //Добавить префиксы
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      .pipe(csscomb())
      // генерацю не миниф стилей в папку source
      .pipe(gulp.dest("./src/css"))
      //Минификация CSS
      .pipe(
        cleanCSS({
          level: 0,
        })
      )
      .pipe(sourcemaps.write("./"))
      //Выходная папка для стилей
      .pipe(gulp.dest("./build/css"))
      .pipe(browserSync.stream())
  );
});

// Таск для обработки скриптов
gulp.task("scripts", () => {
  //Шаблон для поиска файлов JS
  //Всей файлы по шаблону './src/js/**/*.js'
  return (
    gulp
      .src(scriptFiles)
      // Объединение файлов в один
      .pipe(concat("script.js"))
      // Минификация JS
      .pipe(
        uglify({
          toplevel: false,
        })
      )
      //Выходная папка для скриптов
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
});

//Таск для очистки папки build
gulp.task("del", () => {
  return del(["build/*"], { dryRun: true });
});

gulp.task("image-compress", function () {
  return gulp
    .src("./src/img/**")
    .pipe(imagemin())
    .pipe(gulp.dest("./build/img"));
});

gulp.task("minifyHTML", () => {
  return (
    gulp
      .src("src/**/*.html")
      // .pipe(fileinclude({
      //   prefix: '@@',
      //   basepath: 'src/view-parts'
      // }))
      // .pipe(htmlmin({ collapseWhitespace: false }))
      .pipe(gulp.dest("./build"))
  );
});

gulp.task("svg-sprite", function () {
  return (
    gulp
      .src("./src/img/*.svg")
      // минификатор svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        })
      )
      // удаляем атрибуты
      // .pipe(cheerio({
      //       run: function ($){
      //          $('[stroke]').removeAttr('stroke');
      //          $('[style]').removeAttr('style');
      //       },
      //       parserOptions: {
      //          xmlMode:true
      //        }
      // }))
      //правим символы после удаления
      .pipe(replace("&gt", ">"))
      // собираем спрайт
      .pipe(
        svgSprite({
          mode: {
            stack: {
              sprite: "../sprite.svg", //sprite file name
            },
          },
        })
      )
      .pipe(gulp.dest("build/img"))
  );
});

gulp.task("copy", function () {
  return gulp
    .src(
      [
        "src/fonts/**/*",
        "src/bootstrap-4.2.1/**/*",
        "src/dropzone-5.7.0/**/*",
        "src/select2/**/*",
        "src/slick/**/*",
        "src/js/**/*",
      ],
      {
        base: "src",
      }
    )
    .pipe(gulp.dest("build"));
});

gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
  //Следить за файлами со стилями с нужным расширением
  gulp.watch("./src/less/**/*.less", gulp.series("styles"));
  //Следить за добавление изображений
  gulp.watch("./src/img/**", gulp.series("image-compress"));
  gulp.watch("./src/img/*.svg", gulp.series("svg-sprite"));
  //Следить за JS файлами
  gulp.watch("./src/js/**/*.js", gulp.series("scripts"));

  gulp.watch("./src/view-parts/*.html", gulp.series("minifyHTML"));

  gulp.watch("./src/*.html", gulp.series("minifyHTML"));

  gulp.watch("./build/*.html").on("change", browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task(
  "start",
  gulp.series(
    "del",
    gulp.parallel(
      "copy",
      "styles",
      "image-compress",
      "svg-sprite",
      "scripts",
      "minifyHTML"
    ),
    "watch"
  )
);
