const express = require("express");
var server = express.Router();
var sqlDelete = require('../data/sqlDelete');
const sql = require('mssql');
var myDate;
//删除帖子
server.delete('/api/deletePost/', async (req, res) => {
    let r = await sqlDelete.deletePost(req);
    if (r != null) {
        console.log('Post ' + req.body.postID + ' has been deleted at ' + myDate.toLocaleTimeString());
        res.send('success.');
    } else {
        res.status(500).send('error.');
    }
});

//删除账户
server.delete('/api/deleteUser/', async (req, res) => {
    let r = await sqlDelete.deleteUser(req);
    if (r != null) {
        console.log('User ' + req.body.userID + ' has been deleted at ' + myDate.toLocaleTimeString());
        res.send('success.');
    } else {
        res.status(500).send('error.');
    }
});

module.exports = server;