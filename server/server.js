const elasticsearch = require("elasticsearch");
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const client = new elasticsearch.Client({
  host: "deepscholar.elasticsearch:9200",
  log: "trace"
});

app.get("/api/search", (req, res) => {
  if (!req.query.q) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  const params = Object.assign({
    index: "documents"
  }, req.query);

  client.search(params).then((json) => {
    res.json(json);
  }, (error) => {
    console.log(error);
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});