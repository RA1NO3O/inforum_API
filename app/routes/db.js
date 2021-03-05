// const sql = require('mssql');
// const info ={
//     user: 'ra1no3o',
//     password: 'RainXD7246',
//     server: '8.129.212.186',
//     database: 'Inforum_Data_Center',
//     options: {
//         encrypt: true
//     }
// }
// const query = function(sql, sqlParams, callback) {
//     sql.connect(config).then(() => {
//         new sql.Request()
//             .input('query', sql.NVarChar, req.query.query)
//             .query(`SELECT * FROM getPosts WHERE title LIKE '%'+@query+'%' 
//                         OR body_S LIKE '%'+@query+'%'
//                         OR tags LIKE '%'+@query+'%'`
//             ).then((recordset) => {
//                 console.log(recordset);
//                 return new Promise(function (back, reject) {
//                     back(recordset);
//                 });
//                 // console.dir(recordset);
//             }).catch((err) => {
//                 return new Promise(function (back, reject) {
//                     back(null);
//                 });
//             });
//     // pool.getConnection((err, conn) => {
//     //   if (err) {
//     //     // 连接失败的回调
//     //     callback(err, null, null)
//     //   } else {
//     //     // 连接成功
//     //     // conn 连接对象    query方法 连接对象内部的方法
//     //     conn.query(sql, sqlParams, (err, value, fields) => {
//     //       // 归还连接对象
//     //       conn.release();
//     //       callback(err, value, fields);
//     //     })
//     //   }
//     // }) 
//   }
//   sql.connect(config).then(() => {
//     new sql.Request()
//         .input('query', sql.NVarChar, req.query.query)
//         .query(`SELECT * FROM getPosts WHERE title LIKE '%'+@query+'%' 
//                     OR body_S LIKE '%'+@query+'%'
//                     OR tags LIKE '%'+@query+'%'`
//         ).then((recordset) => {
//             console.log(recordset);
//             return new Promise(function (back, reject) {
//                 back(recordset);
//             });
//             // console.dir(recordset);
//         }).catch((err) => {
//             return new Promise(function (back, reject) {
//                 back(null);
//             });
//         });
// });
//   module.exports = query