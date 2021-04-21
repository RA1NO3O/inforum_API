const express = require("express");
var server = express.Router();
var sqlInsert = require('../data/sqlInsert');
const logger = require("./logger");
var nowDate;

//注册
server.post('/api/createAccount/', async (req, res) => {
    let r = await sqlInsert.createAccount(req);
    if (r != null) {
        nowDate = new Date();
        var msg = 'A new user ' + req.body.username + ' has been created.';
        console.log(msg+` at ${nowDate.toLocaleString()}`);
        logger.log(msg);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

//新建帖子
server.post('/api/newPost/', async (req, res) => {
    let r = await sqlInsert.newPost(req);
    if (r != null) {
        nowDate = new Date();
        var msg = 'A new post has been created.';
        console.log(msg+` at ${nowDate.toLocaleString()}`);
        logger.log(msg);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

//新建回复
server.post('/api/newComment/', async (req, res) => {
    let r = await sqlInsert.newComment(req);
    if (r != null) {
        nowDate = new Date();
        var msg = `A new comment has been posted by ${req.body.editorID}.`;
        console.log(msg+` at ${nowDate.toLocaleString()}`);
        logger.log(msg);
        res.send('success.');
    }else{
        res.status(400).send('error.');
    }
});

module.exports = server;