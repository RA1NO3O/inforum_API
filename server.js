//server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('mssql');
require('./app/routes')(app,{});



app.listen(8080,()=> {
    console.log('app listening on http://localhost:8080');
});