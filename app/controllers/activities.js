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
    input.set_Date(date);
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
  var calculatePercentageOfActivitities = function(activities){
    var total = activities.sleep + activities.veryActiveMinutes + activities.sedentaryMinutes + activities.fairlyActiveMinutes + activities.lightlyActiveMinutes;
    var totalLeds = 102;
    var result = {
      sleepTime: Math.max(1, Math.floor(activities.sleep*totalLeds/total)),
      veryActive: Math.max(1, Math.floor(activities.veryActiveMinutes*totalLeds/total)),
      sedentary: Math.max(1, Math.floor(activities.sedentaryMinutes*totalLeds/total)),
      fairly: Math.max(1, Math.floor(activities.fairlyActiveMinutes*totalLeds/total)),
      lightly: Math.max(1, Math.floor(activities.lightlyActiveMinutes*totalLeds/total))
    }
    return result;
  }
  
  var onActivitiesSelectDate = function(req, res, next){
      var _date = req.param("date");
      common.cache.put('date', _date);
      _getActivitiesDataByDate(_date, function(data){
        data.sleep = 400;
        var percentage = calculatePercentageOfActivitities(data);
        ArduinoProxy.sendActivities(percentage);
        res.send(percentage);
      }, function(error){
        console.log(error);
        res.send("ERROR: Could not retreive data");
      });
  };

  app.get("/activities/date/select/:date", onActivitiesSelectDate);
};