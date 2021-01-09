const config=require('../../config/db')
const sql = require('mssql');
module.exports=function(app,db){
    app.post('/whoRyou',(req,res)=>{
        console.log(req.body);
        res.send('Inforum Web API V1.0');
    });
    app.get('/',function(req,res){
        res.send('Hello from RA1NO3O');
    });
    app.get('/test',function(req,res){
        
    })

    //刷新首页帖子流
    app.get('/api/refreshPostStream', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .query('select * from tbPost').then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                }).catch(function (err) {
                    console.log(err);
                    res.send(err);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //获取帖子及其附属回复帖信息
    app.get('/api/getPost', function (req, res) {
        sql.connect(config).then(function () {
            new sql.Request()
                .input('input_parameter', sql.Int, 10000001)
                .query('select * from tbPost where post_ID = @input_parameter').then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                }).catch(function (err) {
                    console.log(err);
                    res.send(err);
                });
        }).catch(function (err) {
            console.log(err);
            res.send(err);
        });
    });

    //获取目标用户个人资料及其发布的所有帖子
    app.get('/api/getUserProfile',function (req,res){
        sql.connect(config).then(function(){
            new sql.Request()
                .input('userID',sql.Int, 10000001)
                .query('SELECT * FROM tbInfo_user where id = @userID').then(function (recordset){
                    console.dir(recordset); //在终端输出
                    res.json(recordset);
                }).catch(function(err){
                    console.log(err);
                    res.send(err);
                });
        }).catch(function (err){
            console.log(err);
            res.send(err);
        });
    });

};