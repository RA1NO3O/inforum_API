const sql = require('mssql');
const config = require('../../config/db');

module.exports = {
    editPost: function (req) {
        return new Promise(async (back) => {
            await sql.connect(config).then(async () => {
                await new sql.Request()
                    .input('userName', sql.VarChar, req.query.userName) //多字段查询
                    .query(
                        `SELECT id, username from dbo.tbLogin_userToken
                             WHERE (username = @userName OR email = @userName) OR (phone = @userName)`)
                    .then((recordset) => {
                        back(recordset);
                    }).catch((err) => {
                        console.log(err);
                        res(null);
                    });
            });
        });
    },
};