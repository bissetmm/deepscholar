const request = require("request");
const common = require("./common.js");

(async () => {
  const config = await common.loadDeepScholarConfig();

  request.delete({
    url: `http://localhost:${config.DS_ES_PORT}/*`
  }, (error, response) => {
    if (response.statusCode === 200) {
      console.log(`All Indexes have been deleted.`);
      return;
    }

    console.error(`Indexes have not been deleted.`);
    console.log(`StatusCode: ${response.statusCode}`);
  });
})();
