const express = require("express");
var server = express.Router();
var sqlInsert = require('../data/sqlInsert');
var myDate;

//注册
server.post('/api/createAccount/', async (req, res) => {
    let r = await sqlInsert.createAccount(req);
    if (r != null) {
        myDate = new Date();
        console.log('A new user ' + req.body.username + ' has been created at ' + myDate.toLocaleTimeString());
        console.dir(r);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

//新建帖子
server.post('/api/newPost/', async (req, res) => {
    let r = await sqlInsert.newPost(req);
    if (r != null) {
        myDate = new Date();
        console.log('A new post has been created at ' + myDate.toLocaleTimeString());
        console.dir(r);
        res.send('success.');
    } else {
        res.status(400).send('error.');
    }
});

//新建回复
server.post('/api/newComment/', async (req, res) => {
    let r = await sqlInsert.newComment(req);
    if (r != null) {
        myDate = new Date();
        console.log('A new comment has been created at ' + myDate.toLocaleTimeString());
        console.dir(r);
        res.send('success.');
    }else{
        res.status(400).send('error.');
    }
});

module.exports = server;