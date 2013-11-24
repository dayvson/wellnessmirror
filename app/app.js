//var env = process.env;
var express = require('express');
var app  = express();
var memory = require("memory-cache");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


app.get("/index", function(req, res, next){
  res.render("slider");
});

app.get("/color", function(req, res, next){
  var red = memory.get('red');
  var green = memory.get('green');
  var blue = memory.get('blue');
  console.log(red);
  res.send(red+","+green+";"+blue);
});

app.post("/setcolor", function(req, res, next) {
  memory.put("red", req.body.red);
  memory.put("green", req.body.green);
  memory.put("blue", req.body.blue);
  res.send(req.body); 
});

app.listen(3000);