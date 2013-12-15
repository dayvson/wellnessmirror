module.exports = function(app){
  var common = require(__dirname + "/../common");
  var ArduinoProxy = require(__dirname + "/../arduino");
  var models = require(__dirname + "/../models");
  var async = require("async");

  var renderSleepDataByPeriode = function(req, res, next){
     var _start = req.param("start");
     var _end = req.param("end");
     var _dateStr;
     var howmanyDays = common.getDateDifferenceIndays(_start, _end);
     var resultsByRange = [];
     var startDate = new Date(_start + " 00:00:00");
     var range = [];
     var year, month, date;
     for(var i = 0; i<=howmanyDays; i++){
         year = startDate.getFullYear();
         month = startDate.getMonth() >= 9 ? startDate.getMonth() + 1 : "0" + (startDate.getMonth()+1);
         date = startDate.getDate() > 9 ? startDate.getDate() : "0"+startDate.getDate();
         range.push(year+"-"+month+"-"+date);
         startDate.setDate(startDate.getDate()+1);
     };

     var loadData = function(dateStr, callback){
        common.getFitbitData(dateStr, function(data){
          data.date = dateStr;
          resultsByRange.push(data);
          callback();
        }, function(error){
          callback(error);
        }); 
     }
     
     async.map(range, loadData, function(error, results){
        res.send(resultsByRange);
     });
  };
  
  var onUserSelectDate = function(req, res, next){
      var _date = req.body.date;
      common.cache.put('date', _date);
      common.getFitbitData(_date, function(data){
        var hours = data.totalMinutesAsleep;
        var sleep = common.getColorBySleepTime(models.ColorScheme, hours);
        var step = common.getPatternBySteps(models.Patterns, data.steps);
        var result = {"step": step.state, "sleep": sleep.state};
        ArduinoProxy.sendOverall(sleep.color, step.pattern);
        res.send(result);
      }, function(error){
        res.send("ERROR: Could not retreive data");
      });

  };

  app.post("/sleep/date/select", onUserSelectDate);
  app.get("/sleep/range/:start/:end", renderSleepDataByPeriode);
};