const express = require("express");
var server = express.Router();
var sqlInsert = require('../data/sqlInsert');
const sql = require('mssql');
var myDate;

//注册
server.post('/api/createAccount/', async (req, res) => {
    let r = await sqlInsert.createAccount(req);
    console.dir(r);
    res.send(r != null ? 'success.' : 'error.');
});

//新建帖子
server.post('/api/newPost/', async (req, res) => {
    let r = await sqlInsert.newPost(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});

//新建回复
server.post('/api/newComment/', async (req, res) => {
    let r = await sqlQuery.newComment(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});

//点赞👍
server.post('/api/thumbUp/', async (req, res) => {
    let r = await sqlQuery.thumbUp(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});
//踩👎
server.post('/api/thumbDown/', async (req, res) => {
    let r = await sqlQuery.thumbDown(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});
//收藏⭐
server.post('/api/starPost/', async (req, res) =>{
    let r = await sqlQuery.starPost(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});

module.exports = server;