const util = require("util");
const fs = require('fs');
const readline = require('readline');
const {ReadableStream} = require('memory-streams');
const request = require("request");
const Ajv = require('ajv');
const common = require("./common.js");

const filePath = process.argv[2];

const indexName = "papers";

(async () => {
  const config = await common.loadDeepScholarConfig();

  const readFile = util.promisify(fs.readFile);
  const schemaFile = await readFile(`${__dirname}/papers.json`, {encoding: "utf8"})
    .catch(console.log);
  const schema = JSON.parse(schemaFile);
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  // It is recommented that file size are between 5MB to 15MB per 1 bulk api request.
  // https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html#_how_big_is_too_big
  // Please adjust suitable limit byte size to DS_BULK_LIMIT_BYTE_PER_REQUEST
  let processedByte = 0;
  let processedPapers = 0;
  let stream = null;
  readline.createInterface(fs.createReadStream(filePath), {})
    .on("line", line => {
      if (processedByte > config.DS_BULK_LIMIT_BYTE_PER_REQUEST) {
        if (stream) {
          finishRequest(stream, processedPapers);
          stream = null;
        }
        processedByte = 0;
        processedPapers = 0;
      }
      if (stream === null) {
        stream = createRequest(config);
      }
      processedByte = processedByte + Buffer.byteLength(line, 'utf8');
      processedPapers++;

      const json = JSON.parse(line);
      const valid = validate(json);
      if (!valid) {
        console.log(validate.errors);
        return;
      }

      const papers = json;
      Object.keys(papers)
        .forEach(id => {
          const paper = papers[id];
          const {tables, figs} = paper;
          delete paper.tables;
          delete paper.figs;

          const textMeta = {index: {_index: indexName, _type: "text", _id: id}};
          stream.append(`${JSON.stringify(textMeta)}\n${JSON.stringify(paper)}\n`);

          const tablesMeta = {index: {_index: indexName, _type: "tables", _parent: id}};
          tables && tables.forEach(table => {
            stream.append(`${JSON.stringify(tablesMeta)}\n${JSON.stringify(table)}\n`);
          });

          const figsMeta = {index: {_index: indexName, _type: "figs", _parent: id}};
          figs && figs.forEach(fig => {
            stream.append(`${JSON.stringify(figsMeta)}\n${JSON.stringify(fig)}\n`);
          });
        });
    })
    .on("close", () => {
      finishRequest(stream, processedPapers);
    });
})();

function createRequest(config) {
  const stream = new ReadableStream("");

  stream.pipe(request.post({
    url: `http://localhost:${config.DS_ES_PORT}/_bulk`
  }, (error, response) => {
    if (error) {
      console.log(error);
      return;
    }
  }));

  return stream;
}

function finishRequest(stream, count) {
  stream.push(null);
  console.log(`Inserted ${count} papers.`);
}
