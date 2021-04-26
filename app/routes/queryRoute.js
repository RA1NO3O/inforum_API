const express = require("express");
var server = express.Router();
var sqlQuery = require('../data/sqlQuery');
const logger = require("../logger");

//查找用户
server.get('/api/searchUser/', async (req, res) => {
    let r = await sqlQuery.userSearch(req);
    console.dir(r);
    res.json(r);
});

//登录
server.get('/api/login/', async (req, res) => {
    let r = await sqlQuery.login(req);
    console.dir(r);
    logger.log(`user ${req.query.username} trying login.`);
    res.json(r);
});

//获取收藏
server.get('/api/getCollection/:id', async (req, res) => {
    let r = await sqlQuery.getCollection(req);
    console.dir(r);
    logger.log(`user ${req.params.id} browsing collection.`);
    res.json(r);
});

//首页帖子流
server.get('/api/getPosts/:id', async (req, res) => {
    let r = await sqlQuery.getPosts(req);
    console.dir(r);
    logger.log(`user ${req.params.id} get online.`);
    res.json(r);
});

//请求传入id => 获取帖子详情
server.get('/api/getPostDetail/:id', async (req, res) => {
    let r = await sqlQuery.getPostDetail(req);
    console.dir(r);
    res.json(r);
});

//请求传入id => 获取帖子回复
server.get('/api/getComment/:id', async (req, res) => {
    let r = await sqlQuery.getPostComment(req);
    logger.log(`user ${req.query.userID} browsing post#${req.params.id}.`);
    console.dir(r);
    res.json(r);
});

//请求传入id => 获取个人资料
server.get('/api/getProfile/:id', async (req, res) => {
    let r = await sqlQuery.getProfile(req);
    console.dir(r);
    res.json(r);
});

//获取用户发的帖子和回复
server.get('/api/getPostsByUser/:id', async (req, res) => {
    let r = await sqlQuery.getPostsByUser(req);
    console.dir(r);
    res.json(r);
});

//获取用户发布的照片
server.get('/api/getGalleryByUser/:id', async (req, res) => {
    let r = await sqlQuery.getGalleryByUser(req);
    console.dir(r);
    res.json(r);
});
//获取用户点赞的帖子
server.get('/api/getLikedPostsByUser/:id', async (req, res) => {
    let r = await sqlQuery.getLikedPostsByUser(req);
    console.dir(r);
    res.json(r);
});

//模糊查询
server.get('/api/fuzzySearch/', async (req, res) => {
    let postResult = await sqlQuery.postFuzzySearch(req);
    let userResult = await sqlQuery.userFuzzySearch(req);
    console.dir({
        posts: postResult,
        users: userResult,
    });
    res.json({
        posts: postResult,
        users: userResult,
    });
});

server.get('/api/getUserNameByID/', async (req, res) => {
    let r = await sqlQuery.getUserNameByID(req);
    console.dir(r);
    res.json(r);
});

server.get('/api/getUserAccountSettings/', async (req, res) => {
    let r = await sqlQuery.getUserAccountSettings(req);
    console.dir(r);
    res.json(r);
});

module.exports = server;