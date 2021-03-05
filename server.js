//server.js
const express = require('express');
const app = express();
const port = 7246;
const index = require("./app/routes/note_routes");
// const abc =require("./app/routes/abc");    //端口号


app.listen(port, () => {
  console.clear();
  console.log('app listening on http://localhost:' + port);
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(index);