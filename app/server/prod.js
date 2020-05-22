'use strict';

var app = require('./lib').default; // "src" babel code gets transpiled to "lib" directory

const port = process.env.PORT || 3001;

const server = app.listen(port);

server.on('error', err => {
  console.error(err);
});