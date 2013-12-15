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
  
  var onActivitiesDataByRange = function(req, res, next){
    var _start = req.param("start");
    var _end = req.param("end");
    common.getFitbitDataByRange(_start, _end, function(error, data){
        if(!error){
          var percentage = convertActivitiesToTotalLeds(data);
          res.send(percentage);
          ArduinoProxy.sendActivities(percentage);
        }else{
          res.send({"error": "Couldn't not the data"});
        }
    });
  };

  app.get("/activities/range/:start/:end", onActivitiesDataByRange);
};