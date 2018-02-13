const SearchkitExpress = require("searchkit-express");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const engines = require('consolidate');
const searchHistory = require("./models/search_history");
const passport = require("passport");
const jwt = require("jsonwebtoken");

app.set('views', `${__dirname}/views`);
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use('/api/documents', express.static('documents'));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const defineSearchkitRouter = (index) => {
  app.use(`/api/${index}`, SearchkitExpress.createRouter({
    host: "http://deepscholar.elasticsearch:9200",
    index,
    queryProcessor: (query, req) => {
      const authorization = req.headers ? req.headers["authorization"] : null;
      let userId = null;
      if (authorization) {
        const matches = authorization.match(/bearer\s(.+)$/);
        if (matches) {
          const token = matches[1];
          try {
            const user = jwt.verify(token, process.env.DEEP_SCHOLAR_TOKEN_SECRET);
            const sub = JSON.parse(user.sub);
            userId = sub.id;
          } catch (error) {
            console.log(error);
          }
        }
      }

      searchHistory.insert(query, userId);
      return query;
    }
  }));
};
defineSearchkitRouter("papers");
defineSearchkitRouter("figs");
defineSearchkitRouter("tables");

app.use("/api/auth", require("./auth.js")(app));

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});