var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster) {

  console.log("Master pid: " + process.pid);

  var numberOfRequests = 0;

  var numCPUs = require('os').cpus().length /2;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
    console.log('creating process with id = ' + cluster.workers[id].process.pid);

    //getting message
    cluster.workers[id].on('message', function messageHandler(msg) {
      if (msg.cmd && msg.cmd == 'notifyRequest') {
        numberOfRequests += 1;
      }

      console.log("Getting message from process : ", msg.procId);
    });

    //Getting worker online
    cluster.workers[id].on('online', function online()
    {
      console.log("Worker pid: " + cluster.workers[id].process.pid + " is online");
    });

    //printing the listening port
    cluster.workers[id].on('listening', function online(address)
    {
      console.log("Listening on port + " , address.port);
    });

    //Catching errors
    cluster.workers[id].on('exit', function(code, signal) {
      if( signal ) {
        console.log("worker was killed by signal: "+signal);
      } else if( code !== 0 ) {
        console.log("worker exited with error code: "+code);
      } else {
        console.log("worker success!");
      }
    });
  });

  //Printing number of requests
  setInterval(function(){
    console.log("Handled " + numberOfRequests + " requests");
  }, 3000);

} else {

  // Create HTTP server.
  http.Server(function(req, res) {
    res.writeHead(200);
    res.end("This answer comes from the process " + process.pid);

    console.log("Message sent from http server");

    // Notify master about the request
    process.send({ cmd: 'notifyRequest', procId : process.pid });


  }).listen(8080);
}
