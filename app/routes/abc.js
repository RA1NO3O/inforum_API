const express = require("express")
var router=express.Router();


router.post('/abcd',(req,res)=>{
    console.log(req.body.user);
    res.json({
        abc:123
    });
})

module.exports=router;