module.exports = function(app){
  var common = require(__dirname + "/common");
  var Fitbit = require("temboo/Library/Fitbit/Sleep");
  var sleep = new Fitbit.GetSleep(common.session);
  var models = require(__dirname + "/models");
  var input = sleep.newInputSet();
  var async = require("async");

  var _getSleepDataByDate = function(date, success, error){
    if(common.cache.get("currentUser") == null) error("No user found on cache");
    common.addCredentialsToInput(input, common.cache.get("currentUser"));
    input.set_Date(date);
    sleep.execute(
        input,
        function(results){
          var json = JSON.parse(results.get_Response());
          success(json.summary);
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
      res.send(color);
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

  app.get("/sleep/date/:date", renderSleepData);
  app.get("/sleep/range/:start/:end", renderSleepDataByPeriode);
};