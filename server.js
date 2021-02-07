//server.js
const express = require('express');
const app = express();
const port = 7246;    //端口号
require('./app/routes')(app, {});

app.listen(port, () => {
  console.clear();
  console.log('app listening on http://localhost:' + port);
});