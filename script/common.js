const path = require("path");
const properties = require("properties");

module.exports = {
  loadDeepScholarConfig: () => {
    const envFilePath = path.join(__dirname, "../.env");

    return new Promise((resolved, rejected) => {
      properties.parse(envFilePath, {path: true}, (error, obj) => {
        if (error) {
          return rejected(error);
        }
        resolved(obj);
      });
    });
  }
};

