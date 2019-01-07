const fs = require("fs");
const ws = fs.createWriteStream('logger.txt', {flags : "a"});
const randomstring = require("randomstring");
let counter = 1;

module.exports = {
    writeLogs: function(){
        setInterval(() => {
            ws.write(JSON.stringify({log_number: counter++, log_time: new Date(), log_msg: randomstring.generate({length: Math.floor(Math.random() * 50) + 25, charset: 'alphabetic' })}) + "\n");
         }, (Math.floor(Math.random() * 5) + 2) * 1000);
    }
};