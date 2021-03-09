const sql = require('mssql');
const config = require('../../config/db');

module.exports = {
    editPost: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('postID', sql.Int, req.body.postID)
                    .input('title', sql.NVarChar, req.body.title == 'null' ? null : req.body.title)
                    .input('content', sql.NVarChar, req.body.content)
                    .input('tags', sql.NVarChar, req.body.tags == 'null' ? null : req.body.tags)
                    .input('imgURL', sql.VarChar, req.body.imgURL == 'null' ? null : req.body.imgURL)
                    .query(
                        `UPDATE tbPost
                         SET title=@title, body=@content, tags=@tags, imageURL=@imgURL, lastEditTime=getDate()
                         WHERE postID = @postID;`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
    editProfile: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.query.userID)
                    .input('avatarURL', sql.NVarChar, req.body.avatarURL == 'null' ? null : req.body.avatarURL)
                    .input('bannerURL', sql.NVarChar, req.body.bannerURL == 'null' ? null : req.body.bannerURL)
                    .input('nickName', sql.NVarChar, req.body.nickName == 'null' ? null : req.body.nickName)
                    .input('bio', sql.NVarChar, req.body.bio == 'null' ? null : req.body.bio)
                    .input('location', sql.NVarChar, req.body.location == 'null' ? null : req.body.location)
                    .input('birthday', sql.Date, req.body.birthday == 'null' ? null : req.body.birthday)
                    .query(
                        `IF NOT EXISTS (SELECT * FROM tbInfo_user WHERE id = @userID)
                            INSERT INTO tbInfo_user(avatarURL,bannerURL, bio, location, birthday)
                            VALUES(@avatarURL,@bannerURL,@bio,@location,@birthday)
                         ELSE
                            UPDATE tbInfo_user
                            SET avatarURL=@avatarURL, bannerURL=@bannerURL, bio=@bio,
                            location=@location, birthday=@birthday
                            WHERE id = @userID;`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
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