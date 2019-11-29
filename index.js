const fs = require('fs');
const path = require('path');

const copyFile = (src, dst, param) => {
  let paths = fs.readdirSync(src);
  paths.forEach((path) => {
    const _src = src + '/' + path;
    const _dst = dst + '/' + path;
    fs.stat(_src, (err, stats) => {
      if (err) {
        throw err;
      }
      if (stats.isFile()) {
        fs.readFile(_src, 'utf8', (err, data) => {
          if(err) {
            throw err;
          }

          if(param) {
            Object.keys(param).forEach((key) => {
              const value = param[key];
              data = data.replace(new RegExp(`<%\\s*${key}\\s*=%>`, 'g'), value);
            });
          }

          fs.writeFile(_dst, data, () => {});
        });
      } else if (stats.isDirectory()) {
        mkdirs(_dst, () => {
          copyFile(_src, _dst, param);
        });
      }
    });
  });
};

const mkdirs = (dst, callback) => {
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (!err) {
      callback && callback();
    } else {
      mkdirs(path.dirname(dst), () => {
        fs.mkdir(dst, callback);
      });
    }
  });
}

exports.mkdir = mkdirs;
exports.copy = copyFile;
