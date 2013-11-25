//var env = process.env;
var express = require('express');
var app  = express();
var common = require(__dirname + "/common");
var memory = require("memory-cache");
var FitbitProfile = require("temboo/Library/Fitbit/Profile");
var getUserInfoChoreo = new FitbitProfile.GetUserInfo(common.session);
var getUserInfoInputs = getUserInfoChoreo.newInputSet();

// // Instantiate and populate the input set for the choreo
var currentUser = null;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

require(__dirname + "/auth")(app);
require(__dirname + "/sleep")(app);
require(__dirname + "/index")(app);

app.listen(8080);