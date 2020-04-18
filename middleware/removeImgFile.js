const fs = require('fs');

const hapusFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      throw err;
    }
  });
};

exports.hapusFile = hapusFile;
