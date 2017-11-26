const fs = require('fs');
const path = require('path');
const glob = require("glob");

const dirPath = process.argv[2];

glob(`${dirPath}/**/*.png`, (error, files) => {
  if (error) {
    console.log(error);
    return;
  }

  files.forEach((inputFigPath) => {
    const figName = path.basename(inputFigPath);
    const dirName = path.basename(path.dirname(inputFigPath));
    const ourputDirPath = `server/public/figs/${dirName}`;
    const outputFigPath = `${ourputDirPath}/${figName}`;

    withDir(ourputDirPath).then(() => {
      fs.createReadStream(inputFigPath).pipe(fs.createWriteStream(outputFigPath));
    });
  });
});

function withDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.access(dirPath, fs.constants.F_OK, (error) => {
      if (error) {
        fs.mkdir(dirPath, (error) => {
          if (error && error.code !== 'EEXIST') {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
}
