const express = require("express");
var server = express.Router();
var sqlDelete = require('../data/sqlDelete');
const logger = require("./logger");
var nowDate;
//删除帖子
server.delete('/api/deletePost/', async (req, res) => {
    let r = await sqlDelete.deletePost(req);
    if (r != null) {
        nowDate = new Date();
        var msg = 'Post ' + req.body.postID + ' has been deleted at ' + nowDate.toLocaleString();
        console.log(msg+` at ${nowDate.toLocaleString}`);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

//删除账户
server.delete('/api/deleteUser/', async (req, res) => {
    let r = await sqlDelete.deleteUser(req);
    if (r != null) {
        nowDate = new Date();
        var msg = 'User ' + req.body.userID + ' has been deleted.';
        console.log(msg+`at ${nowDate.toLocaleString()}`);
        logger.log(msg);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

module.exports = server;