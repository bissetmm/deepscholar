const {parseString} = require('fast-xml2js');
const camelcase = require('camelcase');
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const util = require("util");

const dirPath = process.argv[2];

const defaultPaperMeta = {
  _index: "papers",
  _type: "lang"
};
const defaultFigMeta = {
  _index: "figs",
  _type: "lang"
};
const shouldBeArray = [
  "author",
  "p",
  "fig",
  "figGroup"
];

glob(`${dirPath}/*`, (error, files) => {
  if (error) {
    console.log(error);
    return;
  }

  files.forEach((dirPath) => {
    const paperId = path.basename(dirPath);
    const fileName = `${paperId}.xml`;
    const filePath = path.join(dirPath, fileName);

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

        const data = result.article;

        const paperMeta = {index: Object.assign(defaultPaperMeta, {_id: paperId})};

        try {
          convertObject(data);

          //index for paper
          data.front.id = paperId;
          console.log(JSON.stringify(paperMeta));
          console.log(JSON.stringify(data.front));

          //index for figs
          const figs = (data.floatsGroup.fig && data.floatsGroup.fig) || [];
          const figsInfloatsGroup = (data.floatsGroup.figGroup && data.floatsGroup.figGroup.forEach((figGroup) => {
            return figGroup.fig;
          })) || [];
          figs.concat(Array.prototype.concat.apply([], figsInfloatsGroup));
          figs.forEach((fig) => {
            const figMeta = {index: defaultFigMeta};
            console.log(JSON.stringify(figMeta));
            console.log(JSON.stringify(Object.assign(fig, {paperId})));
          });
        } catch(e) {
          console.error(`${fileName} may be invalid format.`);
        }
      });
    });
  });
});

function convertObject(d, oldKey) {
  const newKey = oldKey ? camelcase(oldKey) : null;

  // convert key to camel case
  // "journal-title": [
  //   "PLoS ONE"
  // ]
  // to
  // "journalTitle": [
  //   "PLoS ONE"
  // ]
  if (newKey && newKey !== oldKey) {
    d[newKey] = d[oldKey];
    delete d[oldKey];
  }

  let value = newKey ? d[newKey] : d;

  // convert array to single value
  // "journalTitle": [
  //   "PLoS ONE"
  // ]
  // to
  // "journalTitle": "PLoS ONE"
  if (util.isArray(value) && shouldBeArray.indexOf(newKey) === -1) {
    d[newKey] = value[0];
    value = d[newKey];
  }

  // Remove line breaks on head and tail that are generates by fast-xml2js.
  if (typeof value === 'string') {
    d[newKey] = value.trim();
  }

  // move keys inside attributes($)
  // {
  //   "$": {
  //     "img": "journal.pone.0070001_1.png"
  //   }
  // }
  // to
  // {
  //   "img": "journal.pone.0070001_1.png"
  // }
  if (newKey === "$") {
    Object.keys(value).forEach(key => {
      d[key] = value[key];
    });
    delete d["$"];
  }

  if (util.isObject(value)) {
    Object.keys(value).forEach(key => {
      convertObject(value, key);
    });
  }
}