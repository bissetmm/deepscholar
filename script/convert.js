const {parseString} = require('fast-xml2js');
const fs = require('fs');
const path = require('path');
const glob = require("glob");

const dirPath = process.argv[2];

const indexMetaData = {
  _index: "documents",
  _type: "lang"
};

glob(`${dirPath}/*`, (error, files) => {
  if (error) {
    console.log(error);
    return;
  }
  files.forEach((filePath) => {
    fs.readFile(filePath, 'utf8', (error, xml) => {
      if (error) {
        console.log(error);
        throw error;
      }

      parseString(xml, (error, result) => {
        if (error) {
          console.log(error);
          throw error;
        }

        const actionAndMetaData = {index: Object.assign(indexMetaData, {_id: path.basename(filePath, '.xml')})};
        console.log(JSON.stringify(actionAndMetaData));
        console.log(JSON.stringify(result, (key, value) => {
          // Remove line breaks on head and tail that are generates by fast-xml2js.
          if (typeof value === 'string') {
            return value.trim();
          }

          return value;
        }));
      });
    });
  });
});