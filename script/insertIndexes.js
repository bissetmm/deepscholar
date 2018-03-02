const fs = require('fs');
const {ReadableStream} = require('memory-streams');
const request = require("request");
const common = require("./common.js");

const filePath = process.argv[2];

const meta = {
  index: {
    _index: "papers",
    _type: "lang"
  }
};

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

      papers.forEach(item => {
        s.append(`${JSON.stringify(meta)}\n${JSON.stringify(item)}\n`);
      });
      resolve();
    });
  });
}
