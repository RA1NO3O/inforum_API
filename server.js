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

app.all('*', function(req, res, next) {
  console.log(req.headers.origin)
  console.log(req.environ)
  res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        // res.setHeader("Content-Type", "application/json;charset=utf-8");
  if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(index);