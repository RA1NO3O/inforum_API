module.exports=function(app,db){
    app.post('/whoRyou',(req,res)=>{
        console.log(req.body);
        res.send('Inforum Web API V1.0')
    });
    
    app.get('/api/user', function (req, res) {
        sql.connect(config).then(function () {
            //Query
            new sql.Request()
                .input('input_parameter', sql.Int, 10000001)
                .query('select * from tbPost where id != @input_parameter').then(function (recordset) {
                    console.dir(recordset);
                    res.json(recordset);
                }).catch(function (err) {
                    // ...错误检查
                    console.log(err);
                    res.send(err);
                });
        }).catch(function (err) {
            //...错误检查
            console.log(err);
            res.send(err);
        });
    });
    app.post('api/user', function (req, res) {
        
    })
    app.delete('api/user:userId', function (req, res) {
    
    })
};