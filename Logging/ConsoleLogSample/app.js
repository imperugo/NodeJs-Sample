console.log("app starting.....")

var express = require("express");
var expressConfiguration = require("./express-configuration");
var app = express();

console.log("configuring express....");
expressConfiguration.init(app, express);
console.log("Express configured");

var port = Number(process.env.PORT || 5000);

app.get("/", function(req, res) {
    res.render("home/index", {
       applicationName: "Sample Node Demo",
        title: "This text comes from the model"
    });
});

app.listen(port, function() {
    console.log("Listening on " + port);
});
