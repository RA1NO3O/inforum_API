//server.js
const port=7246;    //端口号
const express = require('express');
const app = express();
require('./app/routes')(app,{});

app.listen(port,()=> {
    console.clear();
    console.log('app listening on http://localhost:'+port);
});