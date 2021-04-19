const express = require("express");
var server = express.Router();
var sqlUpdate = require('../data/sqlUpdate');
var myDate;

//编辑帖子
server.post('/api/editPost/', async (req, res) => {
    myDate = new Date();
    let r = await sqlUpdate.editPost(req);
    console.log('Post ' + req.body.postID + ' has been updated at ' + myDate.toLocaleTimeString());
    res.send(r != null ? 'success.' : 'error.');
});

//编辑个人资料
server.post('/api/editProfile/', async (req, res) => {
    myDate = new Date();
    let r = await sqlUpdate.editProfile(req);
    console.log('User profile ' + req.query.userID + ' has been updateed at ' + myDate.toLocaleTimeString());
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

//修改用户名
server.post('/api/editUserName/', async (req, res) => {
    myDate = new Date();
    let r = await sqlUpdate.editUserName(req);
    console.log('User ' + req.body.userID + ' userName has been updated to ' + req.body.userName + ' at ' + myDate.toLocaleTimeString());
    res.send(r != null ? 'success.' : 'error.');
});

//修改密码
server.post('/api/editUserPassword/', async (req, res) => {
    myDate = new Date();
    let r = await sqlUpdate.editUserPassword(req);
    console.log('User ' + req.body.userID + ' password has been updated at ' + myDate.toLocaleTimeString());
    res.send(r != null ? 'success.' : 'error.');
});
module.exports = server;