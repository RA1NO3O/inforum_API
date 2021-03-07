const sql = require('mssql');
const config = require('../../config/db');  //请配置好对应的变量.

module.exports = {
    userSearch: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userName', sql.VarChar, req.query.userName) //多字段查询
                    .query(
                        `SELECT id, username from dbo.tbLogin_userToken
                         WHERE (username = @userName OR email = @userName) OR (phone = @userName)`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    }, login: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('username', sql.VarChar, req.query.username)
                    .input('password', sql.VarChar, req.query.password)
                    .query(
                        `SELECT id from dbo.tbLogin_userToken
                         WHERE (username = @username OR email = @username OR phone = @username)
                         AND password = @password`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    getCollection: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .query(`SELECT DISTINCT [postID],[title],[body_S]
                            ,[imageURL],[lastEditTime],[nickname],[tags],[avatarURL]
                            ,[likeCount],[dislikeCount],[commentCount],[collectCount]
                            ,[editorID],IIF([editorID]=@userID,1,0) AS isEditor
                            ,IIF([user_ID]=@userID,[user_ID],null)AS user_ID
                            ,IIF([user_ID]=@userID,[isCollected],null)AS isCollected
                            ,IIF([user_ID]=@userID,[like_State],null)AS like_State
                            ,IIF([user_ID]=@userID,[collectTime],null)AS collectTime
                            FROM [Inforum_Data_Center].[dbo].[getPosts]
                            WHERE isCollected=1 AND user_ID=@userID
                            ORDER BY collectTime DESC;`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    getPosts: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .query(
                        `SELECT [postID],[title],[body_S],[imageURL],[lastEditTime],
                             [nickname],[tags],[avatarURL],[likeCount],[dislikeCount],
                             [editorID],[commentCount],[collectCount]
                             ,IIF([editorID]=@userID,1,0) AS isEditor
                             ,IIF([user_ID]=@userID,[user_ID],NULL)AS userID
                             ,IIF([user_ID]=@userID,[isCollected],NULL)AS isCollected
                             ,IIF([user_ID]=@userID,[like_State],NULL)AS like_State
                             ,IIF([user_ID]=@userID,[collectTime],NULL)AS collectTime
                             INTO #TEMP FROM [Inforum_Data_Center].[dbo].[getPosts]
                         SELECT DISTINCT * FROM #TEMP 
                         WHERE [userID]=@userID OR [userID] IS NULL
                         ORDER BY lastEditTime DESC;`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    getPostDetail: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('postID', sql.Int, req.params.id) //SQL注入
                    .query(
                        `SELECT * FROM [Inforum_Data_Center].[dbo].[getPostDetail]\
                         WHERE postID = @postID`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
    getPostComment: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('postID', sql.Int, req.params.id)
                    .input('userID', sql.Int, req.query.userID)
                    .query(
                        `SELECT TOP (1000) [postID],[body],[imageURL],[lastEditTime],[username]
                         ,[avatarURL],[nickname],[target_comment_postID],[likeCount],[editorID]
                         ,IIF([user_ID]=@userID,[like_State],null)AS like_State
                         ,IIF([user_ID]=@userID,[user_ID],null)AS user_ID
                         ,IIF([editorID]=@userID,1,0) AS isEditor
                         FROM [Inforum_Data_Center].[dbo].[getPostComment]
                         WHERE  [target_comment_postID] = @postID AND (user_ID=@userID OR user_ID IS NULL)
                         ORDER BY lastEditTime DESC`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
    getProfile: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .query(
                        `SELECT * FROM [Inforum_Data_Center].[dbo].[getProfile]
                         WHERE (getProfile.id = @userID)`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
    getPostsByUser: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .input('currentUserID',sql.Int,req.query.currentUserID)
                    .query(`SELECT DISTINCT [postID],[title],[body_S]
                            ,[imageURL],[lastEditTime],[nickname],[tags],[avatarURL]
                            ,[likeCount],[dislikeCount],[commentCount],[collectCount]
                            ,[editorID],IIF([editorID]=@userID,1,0) AS isEditor
                            ,IIF([user_ID]=@currentUserID,[user_ID],null)AS user_ID
                            ,IIF([user_ID]=@currentUserID,[isCollected],null)AS isCollected
                            ,IIF([user_ID]=@currentUserID,[like_State],null)AS like_State
                            ,IIF([user_ID]=@currentUserID,[collectTime],null)AS collectTime
                            FROM [Inforum_Data_Center].[dbo].[getPosts]
                            WHERE (user_ID=@currentUserID OR user_ID IS NULL) AND editorID=@userID
                            ORDER BY lastEditTime DESC;`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    getGalleryByUser: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .input('currentUserID',sql.Int,req.query.currentUserID)
                    .query(`SELECT DISTINCT [postID],[title],[body_S]
                            ,[imageURL],[lastEditTime],[nickname],[tags],[avatarURL]
                            ,[likeCount],[dislikeCount],[commentCount],[collectCount]
                            ,[editorID],IIF([editorID]=@userID,1,0) AS isEditor
                            ,IIF([user_ID]=@currentUserID,[user_ID],null)AS user_ID
                            ,IIF([user_ID]=@currentUserID,[isCollected],null)AS isCollected
                            ,IIF([user_ID]=@currentUserID,[like_State],null)AS like_State
                            ,IIF([user_ID]=@currentUserID,[collectTime],null)AS collectTime
                            FROM [Inforum_Data_Center].[dbo].[getPosts]
                            WHERE (user_ID=@currentUserID OR user_ID IS NULL) AND imageURL IS NOT NULL AND editorID=@userID
                            ORDER BY lastEditTime DESC;`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    getLikedPostsByUser: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.params.id)
                    .input('currentUserID',sql.Int,req.query.currentUserID)
                    .query(`SELECT DISTINCT [postID],[title],[body_S]
                            ,[imageURL],[lastEditTime],[nickname],[tags],[avatarURL]
                            ,[likeCount],[dislikeCount],[commentCount],[collectCount]
                            ,[editorID],IIF([editorID]=@userID,1,0) AS isEditor
                            ,IIF([user_ID]=@currentUserID,[user_ID],null)AS user_ID
                            ,IIF([user_ID]=@currentUserID,[isCollected],null)AS isCollected
                            ,IIF([user_ID]=@currentUserID,[like_State],null)AS like_State
                            ,IIF([user_ID]=@currentUserID,[collectTime],null)AS collectTime
                            FROM [Inforum_Data_Center].[dbo].[getPosts]
                            WHERE postID in (
                                SELECT postID FROM getPosts WHERE user_ID=@userID AND like_State=1
                            ) AND user_ID=@currentUserID OR user_ID IS NULL
                            ORDER BY lastEditTime DESC;`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    postFuzzySearch: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('query', sql.NVarChar, req.query.query)
                    .query(`SELECT * FROM getPosts WHERE title LIKE '%'+@query+'%' 
                            OR body_S LIKE '%'+@query+'%'
                            OR tags LIKE '%'+@query+'%'`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    },
    userFuzzySearch: function (req) {
        return new Promise(async function (back) {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('query', sql.NVarChar, req.query.query)
                    .query(`SELECT * FROM getProfile 
                                WHERE nickname LIKE '%'+@query+'%'
                                OR username LIKE '%'+@query+'%'`
                    ).then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        back(null);
                    });
            });
        });
    }
};
