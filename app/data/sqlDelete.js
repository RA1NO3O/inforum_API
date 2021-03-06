const sql = require('mssql');
const config = require('../../config/db');  //请配置好对应的变量.

module.exports = {
    deletePost: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('postID', sql.Int, req.body.postID)
                    .query('DELETE FROM tbPost WHERE postID=@postID;')
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
    deleteUser: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userID', sql.Int, req.body.userID)
                    .query(
                        'DELETE FROM tbLogin_userToken WHERE id=@userID;')
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    }
};