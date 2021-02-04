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
    app.get('/api/searchUser', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('username', sql.VarChar, req.query.username) //多字段查询
                .query(
                    'SELECT username from dbo.tbLogin_userToken\
                     WHERE (username = @username OR email = @username) OR (phone = @username)'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                    //TODO:记录日志
                });
        }).catch(function (err) {
            console.log(err);
            res.send('error');
        });
    });
    app.get('/api/login', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('username', sql.VarChar, req.query.username)
                .input('password', sql.VarChar, req.query.password)
                .query(
                    'SELECT id from dbo.tbLogin_userToken\
                     WHERE (username = @username OR email = @username OR phone = @username)\
                     AND password = @password'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                    //TODO:记录日志
                });
        }).catch(function (err) {
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

    //首页帖子流
    app.get('/api/getPosts', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .query('SELECT * FROM [Inforum_Data_Center].[dbo].[getPosts]'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //获取帖子就当前用户的状态
    app.get('/api/getPostState', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.query.userID)
                .input('postID', sql.Int, req.query.postID)
                .query('SELECT * FROM [Inforum_Data_Center].[dbo].[postStateList]\
                    WHERE user_ID = @userID AND post_ID = @postID'
                ).then(function (recordset) {
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
                    'SELECT * FROM [Inforum_Data_Center].[dbo].[getPostDetail]\
                    WHERE getPostDetail.postID = @postID'
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
                .input('postID', sql.Int, req.params.id)
                .query(
                    'SELECT TOP (1000) [body],[imageURL],[lastEditTime],[username],[avatarURL],[nickname]\
                     FROM [Inforum_Data_Center].[dbo].[getPostComment]\
                     WHERE  getPostComment.target_comment_postID = @postID'
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
                .input('userID', sql.Int, req.params.id)
                .query(
                    'SELECT * FROM [Inforum_Data_Center].[dbo].[getProfile]\
                     WHERE (getProfile.id = @userID)'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

};