module.exports = function(app){
  var common = require(__dirname + "/../common");
  var Fitbit = require("temboo/Library/Fitbit/Activities");
  var ArduinoProxy = require(__dirname + "/../arduino");
  var activities = new Fitbit.GetActivities(common.session);
  var models = require(__dirname + "/../models");
  var input = activities.newInputSet();
  var request = require("request");
  var _getActivitiesDataByDate = function(date, success, error){
    if(common.cache.get("currentUser") == null) error("No user found on cache");
    common.addCredentialsToInput(input, common.cache.get("currentUser"));
    console.log("DATE", date);
    input.set_Date(date);
    console.log(input);
    activities.execute(
        input,
        function(results){
          var json = JSON.parse(results.get_Response());
          success(json.summary);
        },
        function(err){
          console.log(err);
          error(err.message);
        }
    );
  };
  
  var onActivitiesSelectDate = function(req, res, next){
      var _date = req.body.date;
      common.cache.put('date', _date);
      _getActivitiesDataByDate(_date, function(data){
        data.sleep = 400;
        ArduinoProxy.sendActivities(data);
        res.send(data);
      }, function(error){
        console.log(error);
        res.send("ERROR: Could not retreive data");
      });
  };

  app.get("/activities/date/select", onActivitiesSelectDate);
};