const config = require('../../config/db')
const sql = require('mssql');

module.exports = function (app, db) {
    var bodyParser = require('body-parser');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    var myDate = new Date();

    app.get('/', function (req, res) {
        res.send('Inforum Web API V1.0<br/>' + myDate.toLocaleTimeString());
    });
    app.get('/whoRyou', (req, res) => {
        res.send('Inforum Web API V1.0<br/> Developed by RA1N at http://github.com/RA1NO3O');
    });
    app.get('/hello', function (req, res) {
        res.send('Hello from RA1NO3O');
    });
    app.get('/test', function (req, res) {
        res.send('test passed.');
    })

    //登录
    app.get('/api/login',function(req,res){
        sql.connect(config).then(function(){
            new sql.Request()
                .input('username',sql.VarChar, req.query.username) //多字段查询
                .input('password', sql.VarChar, req.query.password)
                .query(
                    'SELECT id from dbo.tbLogin_userToken\
                     WHERE ((username = @username OR email = @username) OR (phone = @username))\
                     AND password = @password'
                ).then(function(recordset){
                    console.dir(recordset);
                    res.json(recordset);
                    //TODO:记录日志
                });
        }).catch(function (err){
            console.log(err);
            res.send(err);
        });
    });

    //注册
    app.post('api/createAccount/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('username', sql.VarChar, req.body.username)
                .input('password', sql.VarChar, req.body.password)
                .input('email', sql.VarChar, req.body.email)
                .input('phone', sql.VarChar, req.body.phone)
                .query(
                    'insert into dbo.tbLogin_userToken \
                 (username,password,email,phone)\
                 VALUES (@username, @password, @email, @phone);'
                ).then(function (recordset) {
                    console.log(req.body);
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send('error.');
        });
    })

    //刷新首页帖子流
    app.get('/api/getPosts', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .query('SELECT * FROM getPost').then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //请求传入id => 获取帖子详情
    app.get('/api/getPostDetail/:id', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('postID', sql.Int, req.params.id) //SQL注入
                .query(
                    'SELECT   TOP (100) PERCENT dbo.tbInfo_user.avatarURL, dbo.tbInfo_user.nickname, dbo.tbLogin_userToken.username,\
                    tbPost_1.title, tbPost_1.body, tbPost_1.imageURL, tbPost_1.tags, tbPost_1.lastEditTime,\
                        (SELECT   COUNT(*) AS commentCount\
                         FROM      dbo.tbPost\
                         WHERE   (target_comment_postID = tbPost_1.postID)) AS commentCount\
                    FROM      dbo.tbPost AS tbPost_1 INNER JOIN\
                    dbo.tbInfo_user ON tbPost_1.editorID = dbo.tbInfo_user.id INNER JOIN\
                    dbo.tbLogin_userToken ON dbo.tbInfo_user.id = dbo.tbLogin_userToken.id INNER JOIN\
                    dbo.postStateList AS postStateList_2 ON tbPost_1.postID = postStateList_2.post_ID AND \
                    dbo.tbInfo_user.id = postStateList_2.user_ID\
                    WHERE   (tbPost_1.postID = @postID)\
                    ORDER BY tbPost_1.lastEditTime DESC'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //请求传入id => 获取帖子回复
    app.get('/api/getComment/:id', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('postID', sql.Int, req.params.id) //SQL注入
                .query(
                    'SELECT   TOP (100) PERCENT dbo.tbPost.body, dbo.tbPost.imageURL, dbo.tbPost.lastEditTime, \
                     dbo.tbLogin_userToken.username, dbo.tbInfo_user.avatarURL, dbo.tbInfo_user.nickname\
                     FROM      dbo.tbPost INNER JOIN\
                     dbo.tbInfo_user ON dbo.tbPost.editorID = dbo.tbInfo_user.id INNER JOIN\
                     dbo.tbLogin_userToken ON dbo.tbInfo_user.id = dbo.tbLogin_userToken.id\
                     WHERE   (tbPost.target_comment_postID = @postID)\
                     ORDER BY dbo.tbPost.lastEditTime DESC'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.dir(err);
            res.send(err);

        });
    });

    //请求传入id => 获取个人资料
    app.get('/api/getProfile/:id', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.params.id)//SQL注入
                .query('SELECT * FROM getProfile where id = @userID').then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

};