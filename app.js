const fs = require('fs');
const fs2 = require('fs');
const http = require('http');
const exec = require('child_process').exec;
const index = fs.readFileSync(__dirname + '/index.html');

// Specify the File Path
const fileName = "logger.txt";

// logger.txt file writter, replace or comment this line to use your logger file
require('./writelogs').writeLogs();

const app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

const io = require('socket.io').listen(app);

io.on('connection', function(socket) {

    fs2.open(fileName, 'r', function(err) {

        exec("tail " + fileName, (err, tailLogs, stderr) => {
            tailLogs = tailLogs.replace(new RegExp('\n','g'), '<br />');
            if(!tailLogs){
                tailLogs = "<h3>Log File Empty</h3>"
            }
            socket.emit('logsSync', { message: tailLogs, id: socket.id });
        });

        fs2.watch(fileName, function(event) {

            if(event === "change") {
                exec("tail " + fileName, (err, tailLogs, stderr) => {
                    tailLogs = tailLogs.replace(new RegExp('\n','g'), '<br />');
                    if(!tailLogs){
                        tailLogs = "<h3>Log File Empty</h3>"
                    }
                    socket.emit('logsSync', { message: tailLogs, id: socket.id });
                });
            }
        });
    });
});

app.listen(8080);