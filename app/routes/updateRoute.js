const express = require("express");
var server = express.Router();
var sqlUpdate = require('../data/sqlUpdate');
var logger = require('../logger');
var nowDate;

//编辑帖子
server.post('/api/editPost/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.editPost(req);
    var msg = 'Post ' + req.body.postID + ' has been updated.';
    console.log(msg + ` at ${nowDate.toLocaleString()}.`);
    logger.writeLog(msg);
    res.send(r != null ? 'success.' : 'error.');
});

//编辑个人资料
server.post('/api/editProfile/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.editProfile(req);
    var msg = 'User profile ' + req.query.userID + ' has been updateed.';
    console.log(msg + ` at ${nowDate.toLocaleString()}.`);
    logger.writeLog(msg);
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

//更新用户名
server.post('/api/updateUserName/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.updateUserName(req);
    var msg = `User ${req.body.userID} userName has been updated to ${req.body.userName}.`;
    console.log(msg + ` at ${nowDate.toLocaleString()}.`);
    logger.writeLog(msg);
    res.send(r != null ? 'success.' : 'error.');
});

//更新密码
server.post('/api/updateUserPassword/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.updateUserPassword(req);
    var msg = 'User ' + req.body.userID + ' password has been updated.';
    console.log(msg + ` at ${nowDate.toLocaleString()}`);
    logger.writeLog(msg);
    res.send(r != null ? 'success.' : 'error.');
});

//更新电话号码
server.post('/api/updateUserPhoneNumber/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.updateUserPhoneNumber(req);
    var msg = 'User ' + req.body.userID + ' phoneNumber has been updated.';
    console.log(msg + ` at ${nowDate.toLocaleString()}`);
    logger.writeLog(msg);
    res.send(r != null ? 'success.' : 'error.');
});

//更新邮箱地址
server.post('/api/updateUserEmailAddress/', async (req, res) => {
    nowDate = new Date();
    let r = await sqlUpdate.updateUserEmailAddress(req);
    var msg = 'User ' + req.body.userID + ' email has been updated.';
    console.log(msg + ` at ${nowDate.toLocaleString()}`);
    logger.writeLog(msg);
    res.send(r != null ? 'success.' : 'error.');
});

module.exports = server;