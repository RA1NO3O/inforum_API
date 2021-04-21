const fs = require('fs');
var nowDate;

module.exports = {
    log: function (str) {
        nowDate = new Date();
        fs.appendFileSync('log.txt',`[${nowDate.toLocaleString()}] ${str}\n`);
    },
};