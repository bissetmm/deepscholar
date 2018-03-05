const fs = require('fs');
const {ReadableStream} = require('memory-streams');
const request = require("request");
const common = require("./common.js");

const filePath = process.argv[2];

const indexName = "papers";

(async () => {
  const config = await common.loadDeepScholarConfig();

  const s = new ReadableStream("");

  // s.pipe(process.stdout);
  s.pipe(request.post({
    url: `http://localhost:${config.DS_ES_PORT}/_bulk`
  }, (error, response, body) => {
    console.log(`StatusCode: ${response.statusCode}`);
    console.log(body);

    console.log("");
  }));

  processPaper(s, filePath)
    .then(() => {
      s.push(null);
    })
})();


function processPaper(s, filePath) {
  return new Promise((resolve) => {
    fs.readFile(filePath, 'utf8', (error, json) => {
      if (error) {
        console.log(error);
        throw error;
      }

      const papers = JSON.parse(json);

      if (error) {
        console.log(error);
        throw error;
      }

      let count = 0;
      papers.forEach(paper => {
        const id = ++count;
        const {tables, figs} = paper;
        delete paper.tables;
        delete paper.figs;

        const textMeta = {index: {_index: indexName, _type: "text", _id: id}};
        s.append(`${JSON.stringify(textMeta)}\n${JSON.stringify(paper)}\n`);

        const tablesMeta = {index: {_index: indexName, _type: "tables", _parent: id}};
        tables && tables.forEach(table => {
          s.append(`${JSON.stringify(tablesMeta)}\n${JSON.stringify(table)}\n`);
        });

        const figsMeta = {index: {_index: indexName, _type: "figs", _parent: id}};
        figs && figs.forEach(fig => {
          s.append(`${JSON.stringify(figsMeta)}\n${JSON.stringify(fig)}\n`);
        });
      });
      resolve();
    });
  });
}
