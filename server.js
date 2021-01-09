//server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./app/routes')(app,{});

app.listen(8080,()=> {
    console.clear();
    console.log('app listening on http://localhost:8080');
});