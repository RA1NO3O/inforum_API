const sql = require('mssql');
const config = require('../../config/db');  //请配置好对应的变量.

module.exports = {
    createAccount: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
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
                        `insert into dbo.tbLogin_userToken(username,password,email,phone)
                            VALUES (@username, @password, @email, @phone);`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    newPost: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('title', sql.NVarChar, req.body.title == 'null' ? null : req.body.title)
                    .input('content', sql.NVarChar, req.body.content)
                    .input('tags', sql.NVarChar, req.body.tags == 'null' ? null : req.body.tags)
                    .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
                    .input('editorID', sql.Int, req.body.editorID)
                    .query(
                        `INSERT INTO tbPost (title,body,tags,imageURL,editorID)
                         VALUES (@title,@content,@tags,@imgURL,@editorID);`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    newComment: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('targetPostID', sql.Int, req.body.targetPostID)
                    .input('content', sql.NVarChar, req.body.content)
                    .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
                    .input('editorID', sql.Int, req.body.editorID)
                    .query(
                        `INSERT INTO tbPost (target_comment_postID,body,imageURL,editorID)
                         VALUES (@targetPostID,@content,@imgURL,@editorID);`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    thumbUp: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.body.userID)
                    .input('postID', sql.Int, req.body.postID)
                    .query(
                        `DECLARE @likeState int;
                     SET @likeState=(SELECT like_State FROM postStateList 
                             WHERE post_ID=@postID AND user_ID=@userID);
                     IF NOT EXISTS(SELECT * FROM postStateList
                         WHERE post_ID=@postID AND user_ID=@userID)
                             INSERT INTO postStateList(post_ID,user_ID,like_State)
                             VALUES(@postID,@userID,1)
                     ELSE
                         UPDATE postStateList SET 
                         like_State=IIF(@likeState=0 OR @likeState=2,1,0)
                         WHERE post_ID=@postID AND user_ID=@userID;`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    thumbDown: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.body.userID)
                    .input('postID', sql.Int, req.body.postID)
                    .query(
                        `DECLARE @likeState int;
                         SET @likeState=(SELECT like_State FROM postStateList 
                                 WHERE post_ID=@postID AND user_ID=@userID);
                         IF NOT EXISTS(SELECT * FROM postStateList
                             WHERE post_ID=@postID AND user_ID=@userID)
                                 INSERT INTO postStateList(post_ID,user_ID,like_State)
                                 VALUES(@postID,@userID,2)
                         ELSE\
                             UPDATE postStateList SET 
                             like_State=IIF(@likeState=0 OR @likeState=1,2,0)
                             WHERE post_ID=@postID AND user_ID=@userID;`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    starPost: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.body.userID)
                    .input('postID', sql.Int, req.body.postID)
                    .query(
                        `IF NOT EXISTS(SELECT * FROM postStateList
                             WHERE post_ID=@postID AND user_ID=@userID)
                                 INSERT INTO postStateList(post_ID,user_ID,isCollected,collectTime)
                                 VALUES(@postID,@userID,1,getDate())
                         ELSE
                             UPDATE postStateList SET 
                             isCollected=IIF((SELECT isCollected FROM postStateList 
                                WHERE post_ID=@postID AND user_ID=@userID)=1,0,1)
                             ,collectTime=getDate()
                             WHERE post_ID=@postID AND user_ID=@userID;`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    }
};