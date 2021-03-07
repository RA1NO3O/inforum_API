const express = require("express");
var server = express.Router();
var sqlUpdate = require('../data/sqlUpdate');
const sql = require('mssql');
var myDate;

//编辑帖子
server.post('/api/editPost/', async (req, res) => {
    myDate = new Date();
    let r = await sqlUpdate.editPost(req);
    console.log('Post '+req.body.postID+' has been edited at ' + myDate.toLocaleTimeString());
    res.send(r != null ? 'success.' : 'error.');
});

//点赞👍
server.post('/api/thumbUp/', async (req, res) => {
    let r = await sqlUpdate.thumbUp(req);
    console.dir(r);
    res.send(r != null ? 'success.' : 'error.');
});
//踩👎
server.post('/api/thumbDown/', async (req, res) => {
    let r = await sqlUpdate.thumbDown(req);
    console.dir(r);
    res.send(r != null ? 'success.' : 'error.');
});
//收藏⭐
server.post('/api/starPost/', async (req, res) => {
    let r = await sqlUpdate.starPost(req);
    console.dir(r);
    res.send(r != null ? 'success.' : 'error.');
});
module.exports = server;