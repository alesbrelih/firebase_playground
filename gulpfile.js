////////////////////////////////
// ----- GULP MODULES ------- //

const
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserify = require("browserify"),
    browserSync = require("browser-sync"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-cleancss"),
    plumber = require("gulp-plumber"),
    gutil = require("gutil");

//-----------------------------//
/////////////////////////////////


/////////////////////////////////
// ------ FILES -------------- //

// script files - dependencies

// script files - client

const scriptFiles = ["./src/scripts/**/*.js"];


// sass files

const sassFiles = ["./src/sass/**/*.scss"];

// -----------------------------//
//////////////////////////////////


////////////////////////////////
// ----- TASKS ---------------//


// ----- debug tasks --------- //

//scripts
gulp.task("browserify-debug",()=>{

    return browserify("./src/scripts/app/app.js",{debug:true})
        .bundle()
        .on("error",function(err){
            gutil.log(err);
            this.emit("end");
        })
        .pipe(plumber())
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./public/scripts"));

});

//styles
gulp.task("sass-debug",()=>{

    gulp.src(sassFiles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on("error",function(err){
            gutil.log(err);
            this.emit("end");
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./public/styles"));

});

//----- debug watchers ------ //

gulp.task("browserify-watch-debug",["browserify-debug"],done=>{
    browserSync.reload();
    done();
});

gulp.task("sass-watch-debug",["sass-debug"],done=>{
    browserSync.reload();
    done();
});


gulp.task("debug",["browserify-debug","sass-debug"],()=>{
    browserSync.init({
        server: {
            baseDir: "./public",
            files:["./public/index.html","./src/scripts/app/templates/**/*.html"]
        }
    });

    gulp.watch(scriptFiles,["browserify-watch-debug"]);
    gulp.watch(sassFiles,["sass-watch-debug"]);
});


// ----------------------------//
////////////////////////////////

////////////////////////////////
// ------ PRODUCTION TASKS ----//

//scripts
gulp.task("browserify-production",()=>{
    browserify("./src/scripts/app/app.js",{debug:true})//for sourcemaps
        .bundle()
        .on("error",function(err){
            gutil.log(err);
            this.emit("end");
        })
        .pipe(plumber({errorHandler:function(err){
            gutil.log(err);
            this.emit("end");
        }}))
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./public/scripts/"));
});

//sass
gulp.task("sass-production",()=>{
    gulp.src(sassFiles)
    .pipe(plumber({
        errorHandler:function(err){
            gutil.log(err);
            this.emit("end");
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./public/styles/"));
});




