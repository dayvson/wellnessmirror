module.exports = function(app){
  var common = require(__dirname + "/../common");
  var ArduinoProxy = require(__dirname + "/../arduino");
  var models = require(__dirname + "/../models");

  var convertActivitiesToTotalLeds = function(activities){
    var total = activities.totalMinutesAsleep + activities.veryActiveMinutes + activities.sedentaryMinutes + activities.fairlyActiveMinutes + activities.lightlyActiveMinutes;
    var totalLeds = 102;
    var result = {
      sleepTime: Math.max(1, Math.floor(activities.totalMinutesAsleep*totalLeds/total)),
      veryActive: Math.max(1, Math.floor(activities.veryActiveMinutes*totalLeds/total)),
      sedentary: Math.max(1, Math.floor(activities.sedentaryMinutes*totalLeds/total)),
      fairly: Math.max(1, Math.floor(activities.fairlyActiveMinutes*totalLeds/total)),
      lightly: Math.max(1, Math.floor(activities.lightlyActiveMinutes*totalLeds/total))
    };
    return result;
  }
  
  var onActivitiesSelectDate = function(req, res, next){
      var _date = req.param("date");
      common.getFitbitData(_date, function(data){ 
        var percentage = convertActivitiesToTotalLeds(data);
        ArduinoProxy.sendActivities(percentage);
        res.send(percentage);
      }, function(error){
        console.log(error);
        res.send("ERROR: Could not retreive data");
      });
  };

  app.get("/activities/date/select/:date", onActivitiesSelectDate);
};