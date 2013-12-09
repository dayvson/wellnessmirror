module.exports = function(app){
  var common = require(__dirname + "/../common");
  var Fitbit = require("temboo/Library/Fitbit/Sleep");
  var FitbitSteps = require("temboo/Library/Fitbit/Activities");
  var ArduinoProxy = require(__dirname + "/../arduino");
  var sleep = new Fitbit.GetSleep(common.session);
  var steps = new FitbitSteps.GetActivities(common.session);
  var models = require(__dirname + "/../models");
  var input = sleep.newInputSet();
  var inputSteps = sleep.newInputSet();
  var async = require("async");
  var request = require("request");
  var _getSleepDataByDate = function(date, success, error){
    if(common.cache.get("currentUser") == null) error("No user found on cache");
    common.addCredentialsToInput(input, common.cache.get("currentUser"));
    common.addCredentialsToInput(inputSteps, common.cache.get("currentUser"));
    input.set_Date(date);
    inputSteps.set_Date(date);
    sleep.execute(
        input,
        function(results){
          var json = JSON.parse(results.get_Response());
          steps.execute(
            input,
            function(results){
              var json2 = JSON.parse(results.get_Response());
              json.summary.steps = json2.summary.steps;
              console.log(json2);
              success(json.summary);
            },
            function(err){
              error(err.message);
            }
        );
        },
        function(err){
          error(err.message);
        }
    );
  };
  var renderSleepData = function(req, res, next){
    var _date;
    if(common.cache.get("currentUser") == null){
      res.redirect("/index");
      return;
    }
    _date = req.param("date")|| "2013-11-24";
    _getSleepDataByDate(_date, function(data){
      var hours = data.totalMinutesAsleep;
      var color = common.getColorBySleepTime(models.ColorScheme, hours);
      res.send(color[0]+","+color[1]+";"+color[2]);
    }, function(error){
      res.send("ERROR: Could not retreive data");
    });
    
  }

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
        _getSleepDataByDate(dateStr, function(data){
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
      _getSleepDataByDate(_date, function(data){
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
  app.get("/sleep/date/:date", renderSleepData);
  app.get("/sleep/range/:start/:end", renderSleepDataByPeriode);
};