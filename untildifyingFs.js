const fs = require("fs");
const untildify = require("untildify");

module.exports = {
  existsSync(path) {
    return fs.existsSync(untildify(path));
  },

  writeFile(path, contents, encoding, cb) {
    return fs.writeFile(untildify(path), contents, encoding, cb);
  },

  readFile(path, encoding, cb) {
    return fs.readFile(untildify(path), encoding, cb);
  },

  readFileSync(path, encoding) {
    return fs.readFileSync(untildify(path), encoding);
  },

  lstat(path, cb) {
    return fs.lstat(untildify(path), cb);
  },
};
