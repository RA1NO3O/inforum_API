const config = require('../../config/db')   //请配置好对应的变量.
const sql = require('mssql');

module.exports = function (app, db) {
    var bodyParser = require('body-parser');
    var myDate, startDate = new Date();
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    //基础响应
    app.get('/', function (req, res) {
        myDate = new Date();
        res.send('Inforum Web API V1.0<br/>' + myDate.toLocaleTimeString() + '<br/>Service started at ' + startDate.toLocaleTimeString());
    });
    app.get('/whoRyou/', (req, res) => {
        res.send('Inforum Web API V1.0<br/> Developed by RA1N at http://github.com/RA1NO3O');
    });
    app.get('/hello/', function (req, res) {
        res.send('Hello from RA1NO3O');
    });
    app.get('/test/', function (req, res) {
        res.send('test passed.');
    })

    //查找用户
    app.get('/api/searchUser/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userName', sql.VarChar, req.query.userName) //多字段查询
                .query(
                    'SELECT id, username from dbo.tbLogin_userToken\
                     WHERE (username = @userName OR email = @userName) OR (phone = @userName)'
                ).then(function (recordset) {
                    console.log(req.query.userName);
                    console.dir(recordset);
                    res.json(recordset);
                    //TODO:记录日志
                });
        }).catch(function (err) {
            console.log(err);
            res.send('error');
        });
    });
    //登录
    app.get('/api/login/', function (req, res) {
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
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //注册
    app.post('/api/createAccount/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('username', sql.VarChar, req.body.username)
                .input('password', sql.VarChar, req.body.password)
                .input('email', sql.VarChar, req.body.email == 'null' ? null : req.body.email)
                .input('phone', sql.VarChar, req.body.phone == 'null' ? null : req.body.phone)
                // .input('nickname', sql.NVarChar, req.body.nickname)
                // .input('birthday', sql.Date, req.body.birthday)
                // .input('bio', sql.NVarChar, req.body.bio)
                // .input('gender', sql.NVarChar, req.body.gender)
                // .input('location', sql.NVarChar, req.body.location)
                .query(
                    'insert into dbo.tbLogin_userToken(username,password,email,phone)\
                        VALUES (@username, @password, @email, @phone);'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    console.log(req.body);
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //首页帖子流
    app.get('/api/getPosts/:id', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.params.id)
                .query(
                    'SELECT DISTINCT a.postID, a.title, a.body_S, a.imageURL, a.lastEditTime, a.nickname, a.tags, \
                     a.avatarURL, a.likeCount,a.dislikeCount, a.commentCount, a.collectCount, IIF(a.editorID=@userID,1,0) AS isEditor,\
                     iif(EXISTS(SELECT * WHERE b.user_ID=@userID AND b.post_ID=a.postID),b.isCollected,NULL)AS isCollected,\
                     iif(EXISTS(SELECT * WHERE b.user_ID=@userID AND b.post_ID=a.postID),b.like_State,NULL)AS like_State\
                     FROM getPosts AS a LEFT OUTER JOIN postStateList AS b ON a.postID = b.post_ID\
                     ORDER BY lastEditTime DESC;'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                    // console.log(res);
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
                    'SELECT body FROM [Inforum_Data_Center].[dbo].[getPostDetail]\
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
                .input('userID', sql.Int, req.query.userID)
                .query(
                    'SELECT [postID],[body],[imageURL],[lastEditTime],[username],[avatarURL],[nickname],[likeCount],\
                    iif(EXISTS(SELECT * WHERE b.user_ID=@userID AND b.post_ID=a.postID),b.like_State,NULL)AS like_State,\
                    MAX(b.user_ID) AS user_ID\
                    FROM [Inforum_Data_Center].[dbo].[getPostComment]as a \
                    LEFT OUTER JOIN postStateList AS b \
                    ON a.postID=b.post_ID\
                    WHERE  a.target_comment_postID = @postID\
                    GROUP BY [postID],[body],[imageURL],[lastEditTime],[username],[avatarURL],[nickname],[likeCount],like_State,user_ID,post_ID\
                    ORDER BY lastEditTime DESC'
                ).then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.dir(err);
            res.send(err);

        });
    });

    //点赞👍
    app.post('/api/thumbUp/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.body.userID)
                .input('postID', sql.Int, req.body.postID)
                .query(
                    'DECLARE @likeState int;\
                     SET @likeState=(SELECT like_State FROM postStateList \
                             WHERE post_ID=@postID AND user_ID=@userID);\
                     IF NOT EXISTS(SELECT * FROM postStateList\
                         WHERE post_ID=@postID AND user_ID=@userID)\
                             INSERT INTO postStateList(post_ID,user_ID,like_State)\
                             VALUES(@postID,@userID,1)\
                     ELSE\
                         UPDATE postStateList SET \
                         like_State=IIF(@likeState=0 OR @likeState=2,1,0)\
                         WHERE post_ID=@postID AND user_ID=@userID;'
                ).then(function (recordset) {
                    myDate = new Date();
                    console.log('post ' + req.body.postID + ' state of user(' + req.body.userID + ') has been updated at ' + myDate.toLocaleTimeString());
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });
    //踩👎
    app.post('/api/thumbDown/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.body.userID)
                .input('postID', sql.Int, req.body.postID)
                .query(
                    'DECLARE @likeState int;\
                     SET @likeState=(SELECT like_State FROM postStateList \
                             WHERE post_ID=@postID AND user_ID=@userID);\
                     IF NOT EXISTS(SELECT * FROM postStateList\
                         WHERE post_ID=@postID AND user_ID=@userID)\
                             INSERT INTO postStateList(post_ID,user_ID,like_State)\
                             VALUES(@postID,@userID,2)\
                     ELSE\
                         UPDATE postStateList SET \
                         like_State=IIF(@likeState=0 OR @likeState=1,2,0)\
                         WHERE post_ID=@postID AND user_ID=@userID;'
                ).then(function (recordset) {
                    myDate = new Date();
                    console.log('post ' + req.body.postID + ' state of user(' + req.body.userID + ') has been updated at ' + myDate.toLocaleTimeString());
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });
    //收藏⭐
    app.post('/api/starPost/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.body.userID)
                .input('postID', sql.Int, req.body.postID)
                .query(
                    'IF NOT EXISTS(SELECT * FROM postStateList\
                         WHERE post_ID=@postID AND user_ID=@userID)\
                             INSERT INTO postStateList(post_ID,user_ID,isCollected,collectTime)\
                             VALUES(@postID,@userID,1,getDate())\
                     ELSE\
                         UPDATE postStateList SET \
                         isCollected=IIF((SELECT isCollected FROM postStateList \
                            WHERE post_ID=@postID AND user_ID=@userID)=1,0,1)\
                         WHERE post_ID=@postID AND user_ID=@userID;'
                ).then(function (recordset) {
                    myDate = new Date();
                    console.log('post ' + req.body.postID + ' state of user(' + req.body.userID + ') has been updated at ' + myDate.toLocaleTimeString());
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
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

    //新建帖子
    app.post('/api/newPost/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('title', sql.NVarChar, req.body.title == 'null' ? null : req.body.title)
                .input('content', sql.NVarChar, req.body.content)
                .input('tags', sql.NVarChar, req.body.tags == 'null' ? null : req.body.tags)
                .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
                .input('editorID', sql.Int, req.body.editorID)
                .query(
                    'INSERT INTO tbPost (title,body,tags,imageURL,editorID)\
                     VALUES (@title,@content,@tags,@imgURL,@editorID);'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    console.log(req.body);
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //编辑帖子
    app.post('/api/editPost/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('postID', sql.Int, req.body.postID)
                .input('title', sql.NVarChar, req.body.title == 'null' ? null : req.body.title)
                .input('content', sql.NVarChar, req.body.content)
                .input('tags', sql.NVarChar, req.body.tags == 'null' ? null : req.body.tags)
                .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
                .query(
                    'UPDATE tbPost\
                     SET title=@title, body=@content, tags=@tags, imageURL=@imgURL, lastEditTime=getDate()\
                     WHERE postID = @postID;'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    myDate = new Date();
                    console.log('post ' + req.body.postID + 'has been updated at ' + myDate.toLocaleTimeString());
                    res.send('success.');
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //删除帖子
    app.delete('/api/deletePost/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('postID', sql.Int, req.body.postID)
                .query('DELETE FROM tbPost WHERE postID=@postID;')
                .then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    myDate = new Date();
                    console.log('Post ' + req.body.postID + ' has been deleted at ' + myDate.toLocaleTimeString());
                    res.send('success.');
                })
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //修改用户名
    app.post('/api/editUserName/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.body.userID)
                .input('newUserName', sql.VarChar, req.body.newUserName)
                .query(
                    'UPDATE tbLogin_userToken SET username = @userName\
                     WHERE id=@userID'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    myDate = new Date();
                    console.log('User ' + req.body.userID + 'userName has been changed at' + myDate.toLocaleTimeString());
                    res.send('success.');
                })
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //删除账户
    app.delete('/api/deleteUser/', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('userID', sql.Int, req.body.userID)
                .query(
                    'DELETE FROM tbLogin_userToken WHERE id=@userID;'
                ).then(function (recordset) {
                    console.dir(recordset); //在终端输出
                    myDate = new Date();
                    console.log('User ' + req.body.userID + ' has been deleted at ' + myDate.toLocaleTimeString());
                    res.json(recordset);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

};