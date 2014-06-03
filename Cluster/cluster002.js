var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster) {
  var numCPUs = require('os').cpus().length /2;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log('creating process with id = ' + cluster.workers[id].process.pid);
  });
} else{

  // Create HTTP server.
  http.Server(function(req, res) {
    res.writeHead(200);
    res.end("This answer comes from the process " + process.pid);

  }).listen(8080);
}
