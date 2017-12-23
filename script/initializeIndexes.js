const fs = require('fs');
const path = require('path');
const request = require("request");
const common = require("./common.js");

(async () => {
  const config = await common.loadDeepScholarConfig();

  const indexSchemeDir = path.join(__dirname, "../", "index_schemes");
  ["papers", "figs", "tables"].forEach((indexSchemeName) => {
    fs.createReadStream(path.join(indexSchemeDir, `${indexSchemeName}.json`))
      .pipe(request.put({
        url: `http://localhost:${config.DS_ES_PORT}/${indexSchemeName}`
      }, (error, response) => {
        if (response.statusCode === 200) {
          console.log(`Index(${indexSchemeName}) created.`);
          return;
        }

        console.error(`Index(${indexSchemeName}) have not been created.`);
        console.log(`StatusCode: ${response.statusCode}`);
      }));
  });
})();