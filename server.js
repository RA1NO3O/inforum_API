//server.js
const express = require('express');
var RateLimit = require('express-rate-limit');
const router = express();
const bodyParser = require('body-parser');
const port = 7246;
const queryRoute = require('./app/routes/queryRoute');
const insertRoute = require('./app/routes/insertRoute');
const updateRoute = require('./app/routes/updateRoute');
const deleteRoute = require('./app/routes/deleteRoute');
var logger = require('./app/logger');
const fs = require('fs');

var startDate = new Date(); //启动时间

router.listen(port, () => {
  console.clear();
  logger.log('Server started.');
  console.log('app listening on http://localhost:' + port);
});

//防止DDOS攻击
var limiter = new RateLimit({
  //限速率为1分钟内5条
  windowMs: 1 * 60 * 1000,
  max: 45,
});

router.use(limiter);
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
  res.send('Inforum Web API V1.0<br/>' + myDate.toLocaleString() + '<br/>Service started at ' + startDate.toLocaleString());
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
router.get('/log/', function (req, res) {
  fs.readFile('log.txt', 'utf-8', function (err, data) {
    if (data == '') {
      res.send('empty.');
    } else {
      string = data.replace(/\r\n/g, "<br>");
      string = string.replace(/\n/g, "<br>");
      res.send(string);
    }
    if (err) throw err;
  });
});
router.use(queryRoute);
router.use(insertRoute);
router.use(updateRoute);
router.use(deleteRoute);