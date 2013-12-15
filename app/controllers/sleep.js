module.exports = function(app){
  var common = require(__dirname + "/../common");
  var ArduinoProxy = require(__dirname + "/../arduino");
  var models = require(__dirname + "/../models");
  var renderSleepDataByPeriode = function(req, res, next){
     var _start = req.param("start");
     var _end = req.param("end");
     common.getFitbitDataByRange(_start, _end, function(error, data){
        var minutes = data.totalMinutesAsleep/data.total;
        var sleep = common.getColorBySleepTime(models.ColorScheme, minutes);
        var step = common.getPatternBySteps(models.Patterns, data.steps/data.total);
        var summary = {"step": step.state, "hours": Math.floor(minutes/60), 
                      "minutes": Math.floor(minutes % 60),
                      "sleep": sleep.state};
        res.send(summary);
     });
  };

  app.get("/sleep/range/:start/:end", renderSleepDataByPeriode);
};