const elasticsearch = require("elasticsearch");

module.exports = new class SearchHistory {
  constructor() {
    this.client = new elasticsearch.Client({
      host: "deepscholar.elasticsearch:9200",
      log: "error"
    });
  }

  insert(query, userId) {
    const keyword = query.query.bool.must.length > 0 ? query.query.bool.must[0].bool.should[0].multi_match.query : null;
    return this.client.index({
      index: "search_histories",
      type: "lang",
      body: {
        userId,
        query: keyword,
        created_at: new Date()
      }
    });
  }
}();
