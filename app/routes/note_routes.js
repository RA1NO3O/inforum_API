const config = require('../../config/db')   //TODO:请配置好对应的变量.
const sql = require('mssql');

module.exports = function (app, db) {
    const OSS = require('ali-oss');
    const ossProfile = require('../../config/oss')  //TODO:请在此处配置好对应的变量.
    var bodyParser = require('body-parser');
    var myDate = new Date();
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.put('/api/uploadImage', function (req, res) {
        let client = new OSS(ossProfile);
        let fs = require('fs');
        async function putStream() {
            try {
                let stream = fs.createReadStream(req.body);
                let result = await client.putStream('object-name', stream);
                console.log(result);
            } catch (e) {
                console.log(e);
            }
        }
        putStream();
    });

    //基础响应
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
    app.post('/api/createAccount/', function (req, res) {
        console.log(req);
        sql.connect(config).then(function () {
            new sql.Request()
                .input('username', sql.VarChar, req.body.username)
                .input('password', sql.VarChar, req.body.password)
                .input('email', sql.VarChar, req.body.email)
                .input('phone', sql.VarChar, req.body.phone)
                .input('nickname', sql.VarChar, req.body.nickname)
                .input('birthday', sql.Date, req.body.birthday)
                .input('bio', sql.VarChar, req.body.bio)
                .input('gender', sql.VarChar, req.body.gender)
                .input('location', sql.VarChar, req.body.location)
                .query(
                    'insert into dbo.tbLogin_userToken(username,password,email,phone)\
                        VALUES (@username, @password, @email, @phone);\
                     insert into dbo.tbInfo_user(id,nickname,birthday,bio,gender,location)\
                        VALUES(\
                            (SELECT id FROM tbLogin_userToken WHERE username= @username),\
                            @nickname,@birthday,@bio,@gender,@location\
                        );'
                ).then(function (recordset) {
                    console.log(req.body);
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send('error.');
        });
    });

    //首页帖子流
    app.get('/api/getPosts', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.query.userID)
                .query('SELECT a.postID, a.title, a.body_S, a.imageURL, a.lastEditTime, a.nickname, a.tags, \
                        a.avatarURL, a.likeCount,a.dislikeCount, a.commentCount, a.collectCount, a.editorID,\
                        b.user_ID, b.isCollected, b.like_State, b.collectTime\
                        FROM [Inforum_Data_Center].[dbo].[getPosts] AS a LEFT OUTER JOIN postStateList AS b \
                        ON a.postID = b.post_ID\
                        WHERE b.user_ID = @userID OR b.user_ID IS NULL;'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                    console.log(res);
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
                    'SELECT TOP (1000) [postID],[body],[imageURL],[lastEditTime],[username],[avatarURL],[nickname]\
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

    //删除账户
    app.delete('/api/deleteUser/', function (req, res) {
        console.log(req);
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.VarChar, req.body.userID)
                .query(
                    'DELETE FROM tbLogin_userToken WHERE id=@userID;'
                ).then(function (recordset) {
                    console.log(req.body);
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send('error.');
        });
    });

};