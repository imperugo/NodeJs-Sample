(function (expressConfig) {

  var path = require('path');
  var expressValidator = require('express-validator');

  expressConfig.init = function (app, express) {

    //setup view engine
    console.log("Setting 'Vash' as view engine");
    app.set("view engine", "vash");

    console.log("Setting 'Views' folder");
    var viewsFolder = path.dirname(module.parent.filename) + '/views';
    app.set('views', viewsFolder);

    console.log("Enabling GZip compression.");
    var compression = require('compression');
    app.use(compression({
      threshold: 512
    }));

    console.log("Setting 'Public' folder with maxAge: 1 Day.");
    var publicFolder = path.dirname(module.parent.filename)  + "/public";
    var oneYear = 31557600000;
    app.use(express.static(publicFolder, { maxAge: oneYear }));

    app.use(expressValidator());

    console.log("Setting parse urlencoded request bodies into req.body.");
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    app.use(clientErrorHandler);

    var logger = function(req, res, next) {
        console.log("Got request to req ... " + req.url);
        next(); // Passing the request to the next handler in the stack.
    };

    app.use(logger);

    function clientErrorHandler(err, req, res, next) {
        if (req.xhr) {
            console.log("info","Something wrong with an XHR request",err);
            res.send(500, {
                error: 'Something blew up!'
            });
        } else {
            next(err);
        }
    }
  };

})(module.exports);
