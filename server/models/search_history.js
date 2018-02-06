const elasticsearch = require("elasticsearch");

module.exports = new class SearchHistory {
  constructor() {
    this.client = new elasticsearch.Client({
      host: "deepscholar.elasticsearch:9200",
      log: "error"
    });
  }

  insert(query, userId) {
    return this.client.index({
      index: "search_histories",
      type: "lang",
      body: {
        userId,
        query: query.query.bool.must[0].bool.should[0].multi_match.query,
        created_at: new Date()
      }
    });
  }
}();
