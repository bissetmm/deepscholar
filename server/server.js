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
  const q = req.query.q;

  if (!q) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  client.search({
    index: "documents",
    q
  }).then((json) => {
    res.json(json.hits.hits.map((item) => {
      return item._source;
    }));
  }, (error) => {
    console.log(error);
  });
});
app.get("/api/count", (req, res) => {
  const q = req.query.q;

  if (!q) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  client.count({
    index: "documents",
    q
  }).then((json) => {
    console.log(json)
    res.json({
      count: json.count
    });
  }, (error) => {
    console.log(error);
  });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});