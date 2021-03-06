const express = require("express");
var server = express.Router();
var sqlUpdate = require('../data/sqlInsert');
const sql = require('mssql');
var myDate;

//编辑帖子
server.post('/api/editPost/', function (req, res) {
    sql.connect(config).then(function () {
        new sql.Request()
            .input('postID', sql.Int, req.body.postID)
            .input('title', sql.NVarChar, req.body.title == 'null' ? null : req.body.title)
            .input('content', sql.NVarChar, req.body.content)
            .input('tags', sql.NVarChar, req.body.tags == 'null' ? null : req.body.tags)
            .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
            .query(
                `UPDATE tbPost
                     SET title=@title, body=@content, tags=@tags, imageURL=@imgURL, lastEditTime=getDate()
                     WHERE postID = @postID;`
            ).then(function (recordset) {
                res.send('success.');
                console.dir(recordset); //在终端输出
                myDate = new Date();
                console.log('post ' + req.body.postID + 'has been updated at ' + myDate.toLocaleTimeString());
            });
    }).catch(function (err) {
        console.log(err);
        res.status(500).send(err);
    });
});

//点赞👍
server.post('/api/thumbUp/', async (req, res) => {
    let r = await sqlUpdate.thumbUp(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});
//踩👎
server.post('/api/thumbDown/', async (req, res) => {
    let r = await sqlUpdate.thumbDown(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});
//收藏⭐
server.post('/api/starPost/', async (req, res) =>{
    let r = await sqlUpdate.starPost(req);
    console.dir(r);
    res.send(r != null ? 'success' : 'error.');
});
module.exports = server;