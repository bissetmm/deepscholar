const reader = require('readline')
  .createInterface({
    input: process.stdin
  });

reader.on('line', (line) => {
  const json = JSON.parse(line);
  const {userId, query, created_at: createdAt} = json._source;
  const row = [
    userId,
    query,
    createdAt
  ].join("\t");

  console.log(row);
});
