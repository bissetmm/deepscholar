const common = require("./common.js");
const {MongoClient} = require("mongodb");

(async () => {
  const config = await common.loadDeepScholarConfig();

  const client = await MongoClient.connect(`mongodb://localhost:${config.DS_DB_PORT}`);
  const db = client.db("deepscholar");
  const result = await db.dropDatabase();

  if (result) {
    console.log(`All databases have been deleted.`);
  }

  client.close();
})();
