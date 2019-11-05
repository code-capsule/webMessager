const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const babel = require('gulp-babel');

const DIST_DIR = 'dist';
const rootPath = path.join(process.cwd(), 'packages');

let babelConfig;
try {
  babelConfig = fs.readFileSync(path.join(process.cwd(), '/.babelrc'), 'utf8');
  babelConfig = JSON.parse(babelConfig);
} catch (e) {
  babelConfig = {};
  babelConfig.presets = [
    ["@babel/preset-env", {
        "targets": {
            "browsers": [">0.25%", "ie > 10"]
        },
    }],
    "@babel/typescript"
  ];
  babelConfig.plugins = ['@babel/plugin-transform-runtime','@babel/plugin-syntax-dynamic-import']
}


const packages = fs.readdirSync(rootPath).map(item => {
  return {
    name: item,
    src: path.join(rootPath, item),
  };
});

function findPackageByFile(filePath) {
  return packages.filter(item => {
    return new RegExp(`^${item.src}`).test(filePath);
  })[0];
}

function gernerateProductionTask() {
  const tasks = [];

  packages.forEach(item => {
    tasks.push(buildScript(`${item.src}/src/**/*.ts`, path.join(item.src, DIST_DIR)));
  });

  return tasks;
}

// 开发时构建
function gernerateBuildTask() {
  const tasks = [];
  babelConfig.ignore = ['**/*.d.ts'];
  packages.forEach(item => {
    tasks.push(buildScript(`${item.src}/src/**/*.ts`, path.join(item.src, DIST_DIR)));
  });

  return tasks;
}

function buildScript(src, dest) {
  return function() {
    return gulp
      .src(src)
      .pipe(babel(babelConfig))
      .pipe(gulp.dest(dest));
  };
}

function watch() {
  

  const paths = {
    scripts: {
      src: path.join(rootPath, '*/src/**/*.ts'),
    },
  };

  const watcher = gulp.watch(paths.scripts.src);
  console.log('start watch ', paths.scripts.src, '...');

  function handleChange(filePath) {
    console.log(`File ${filePath} was changed`);

    const package = findPackageByFile(filePath);
    if (package) {
      const relativePath = path.relative(path.join(package.src, 'dist'), path.dirname(filePath));
      buildScript(filePath, path.join(package.src, DIST_DIR, relativePath))();
    }
  }
  watcher.on('change', handleChange);
  watcher.on('add', handleChange);
}

exports.build = gulp.series(...gernerateProductionTask());
exports.watch = gulp.series(...gernerateBuildTask(), watch);
