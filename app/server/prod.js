'use strict';

const app = require('./lib').default; // "src" babel code gets transpiled to "lib" directory

// It looks like that GAE is setting PORT env var (to 8080).
// Let nginx listen to 8080 and forward requests to hard-coded 3001 port.
const port = 3001;

const server = app.listen(port);

server.on('error', err => {
  console.error(err);
});
