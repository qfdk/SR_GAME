var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker %d died (%s). restarting...',worker.process.pid, signal || code);
        cluster.fork();
    });
} else {
    console.log("[worker] " + process.pid);
    require("./server.js");
}