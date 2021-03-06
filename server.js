//server.js
const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const port = 7246;
const queryRoute = require('./app/routes/queryRoute');
const insertRoute = require('./app/routes/insertRoute');
const updateRoute = require('./app/routes/updateRoute');
const deleteRoute = require('./app/routes/deleteRoute');


var startDate = new Date(); //启动时间

router.listen(port, () => {
  console.clear();
  console.log('app listening on http://localhost:' + port);
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.all('*', function (req, res, next) {
  // console.log(req.headers.origin);
  // console.log(req.environ);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  // res.setHeader("Content-Type", "application/json;charset=utf-8");
  // if(req.method === "OPTIONS") res.send(200);else  /*让options请求快速返回*/
  next();
});

//基础响应
router.get('/', function (req, res) {
  var myDate = new Date();
  res.send('Inforum Web API V1.0<br/>' + myDate.toLocaleTimeString() + '<br/>Service started at ' + startDate.toLocaleTimeString());
});
router.get('/whoRyou/', function (req, res) {
  res.send('Inforum Web API V1.0<br/> Developed by RA1N at <a href="http://github.com/RA1NO3O">Github/RA1NO3O</a>');
});
router.get('/hello/', function (req, res) {
  res.send('Hello from RA1NO3O (oﾟvﾟ)ノ');
});
router.get('/test/', function (req, res) {
  res.send('test passed.');
});
router.use(queryRoute);
router.use(insertRoute);
router.use(updateRoute);
router.use(deleteRoute);