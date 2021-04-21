const fs = require('fs');
var nowDate;

module.exports = {
    log: function (str) {
        nowDate = new Date();
        fs.appendFile(`log.txt','[${mydate.toLocalString()}] ${str}\n`, function (err) {
            if (err) throw err;
        });
    },
};