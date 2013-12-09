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
  var index = function(req, res, next){
    var currentUser = common.cache.get("currentUser");
    if(currentUser == null){
      res.redirect("/login");
      return;
    }
    getUserProfileData(function(data){
      var userData = JSON.parse(data);
      res.render("slider", userData);
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

  app.get("/logout", logout);
  app.get("/color", getColor);
  app.post("/setcolor", setColor);
  app.get("/index", index);
  app.get("/", index);


};