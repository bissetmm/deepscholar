const SearchkitExpress = require("searchkit-express");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const defineSearchkitRouter = (index) => {
  app.use(`/${index}`, SearchkitExpress.createRouter({
    host: process.env.ELASTIC_URL || "http://deepscholar.elasticsearch:9200",
    index
  }));
};
defineSearchkitRouter("papers");
defineSearchkitRouter("figs");
defineSearchkitRouter("tables");

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});