const util = require("util");
const fs = require('fs');
const {ReadableStream} = require('memory-streams');
const request = require("request");
const Ajv = require('ajv');
const common = require("./common.js");

const filePath = process.argv[2];

const indexName = "papers";

(async () => {
  const config = await common.loadDeepScholarConfig();

  const s = new ReadableStream("");

  // s.pipe(process.stdout);
  s.pipe(request.post({
    url: `http://localhost:${config.DS_ES_PORT}/_bulk`
  }, (error, response, body) => {
    console.log(`StatusCode: ${response.statusCode}`);
    console.log(body);

    console.log("");
  }));
  
  const readFile = util.promisify(fs.readFile);
  const jsonFile = await readFile(filePath, {encoding: 'utf8'});
  const schemaFile = await readFile(`${__dirname}/papers.json`, {encoding: "utf8"});

  const schema = JSON.parse(schemaFile);
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const json = JSON.parse(jsonFile);
  const valid = validate(json);
  if (!valid) {
    console.log(validate.errors);
    return;
  }

  const papers = json;
  Object.keys(papers).forEach(id => {
    const paper = papers[id];
    const {tables, figs} = paper;
    delete paper.tables;
    delete paper.figs;

    const textMeta = {index: {_index: indexName, _type: "text", _id: id}};
    s.append(`${JSON.stringify(textMeta)}\n${JSON.stringify(paper)}\n`);

    const tablesMeta = {index: {_index: indexName, _type: "tables", _parent: id}};
    tables && tables.forEach(table => {
      s.append(`${JSON.stringify(tablesMeta)}\n${JSON.stringify(table)}\n`);
    });

    const figsMeta = {index: {_index: indexName, _type: "figs", _parent: id}};
    figs && figs.forEach(fig => {
      s.append(`${JSON.stringify(figsMeta)}\n${JSON.stringify(fig)}\n`);
    });
  });

  s.push(null);
})();
