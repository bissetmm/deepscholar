const SearchkitExpress = require("searchkit-express");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const engines = require('consolidate');
const searchHistory = require("./models/search_history");
const Auth = require("./auth.js");

app.set('views', `${__dirname}/views`);
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use('/api/documents', express.static('documents'));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const defineSearchkitRouter = (typeName) => {
  app.use(`/api/papers/${typeName}`, SearchkitExpress.createRouter({
    host: "http://deepscholar.elasticsearch:9200",
    index: `papers/${typeName}`,
    queryProcessor: (query, req) => {
      if (/.+\/text$/.test(req.baseUrl)) {
        Auth.getVerifiedUserId(req.headers)
          .then(userId => {
            searchHistory.insert(query, userId);
          })
          .catch(console.log);
      }

      return query;
    }
  }));
};

defineSearchkitRouter("text");
defineSearchkitRouter("tables");
defineSearchkitRouter("figs");

app.use("/api/auth", Auth.router(app));
app.use("/api/label", require("./label.js")(app));

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
