module.exports = function(app){
  var common = require(__dirname + "/../common");
  var Fitbit = require("temboo/Library/Fitbit/Profile");
  var getUserInfo = new Fitbit.GetUserInfo(common.session);
  var input = getUserInfo.newInputSet();
  var getUserProfileData = function(callback){
    input = common.addCredentialsToInput(input, common.cache.get("currentUser"));
    getUserInfo.execute(
      input,
      function(results){
        callback(results.get_Response());
      },
      function(error){
        console.log(error.type); console.log(error.message);
      }
    );
  };
  var getUserData = function(req, res, callback){
    var currentUser = common.cache.get("currentUser");
    if(currentUser == null){
      res.redirect("/login");
      return;
    }
    getUserProfileData(function(data){
      var userData = JSON.parse(data);
      callback(userData);
    });
  };

  var index = function(req, res, next){
      getUserData(req, res, function(data){
        res.render("home", data);
      });
  };
  var setColor = function(req, res, next) {
    memory.put("red", req.body.red);
    memory.put("green", req.body.green);
    memory.put("blue", req.body.blue);
    res.send(req.body); 
  };

  var getColor = function(req, res, next){
    var red = memory.get('red');
    var green = memory.get('green');
    var blue = memory.get('blue');
    console.log(red);
    res.send(red+","+green+";"+blue);
  };

  var logout = function(req, res, next){
    common.cache.del("currentUser");
    res.redirect("/login");
  };


  var about = function(req, res, next){
    getUserData(req, res, function(data){
      res.render("about", data);
    });
  };

  app.get("/logout", logout);
  app.get("/about", about);
  app.get("/color", getColor);
  app.post("/setcolor", setColor);
  app.get("/index", index);
  app.get("/", index);

};