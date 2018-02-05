const {MongoClient} = require("mongodb");

class DB {
  constructor() {
    this.db = null;

    MongoClient.connect("mongodb://deepscholar.database:27017")
      .then((client) => {
        this.db = client.db("deepscholar");
      });
  }

  connection() {
    return this.db;
  }
}

module.exports = new DB();