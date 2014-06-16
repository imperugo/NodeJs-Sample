var logger = require("./utils/logger");

logger.info("Listening on " + port);

var express = require("express");
var app = express();

var expressConfiguration = require("./express-configuration");

logger.info("configuring express....");
expressConfiguration.init(app, express);
logger.info("Express configured");

var port = Number(process.env.PORT || 5000);

app.get("/", function(req, res) {
    res.render("home/index", {
       applicationName: "Sample Node Demo",
        title: "This text comes from the model"
    });
});

app.get("/Error", function(req, res) {
  throw new Error();
});

app.listen(port, function() {
    logger.info("Listening on " + port);
});
