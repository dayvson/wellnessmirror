var async = require("async");
var FitbitActivities = require("temboo/Library/Fitbit/Activities");
var FitbitSleep = require("temboo/Library/Fitbit/Sleep");
var tsession = require("temboo/core/temboosession");
var common = {
  consumerKey: "cdcece2633d54bd9bcb3b6b94db3dcd8",
  consumerSecret: "30b0566ee009456b90dc4e36ea3efca4",
  userAccount:"dayvson", 
  appName:"wellnessmirror", 
  appKey:"a07807fe-bd06-4dca-8",
  forwardURL:"http://ec2-54-200-31-246.us-west-2.compute.amazonaws.com:8080/credentials"
};

var session = new tsession.TembooSession(common.userAccount, common.appName, common.appKey);
var activities = new FitbitActivities.GetActivities(session);
var sleep = new FitbitSleep.GetSleep(session);
var inputActivities = activities.newInputSet();
var inputSleep = sleep.newInputSet();


common.getDateDifferenceIndays = function(startDateStr, endDateStr){
  var startDate = new Date(startDateStr + " 00:00:00");
  var endDate = new Date(endDateStr + " 00:00:00");
  var diff = endDate - startDate;
  var dayinMillis = 86400000;
  return Math.floor(diff/dayinMillis);
};

common.addCredentialsToInput = function(input, currentUser){
  input.set_UserID(currentUser.id);
  input.set_AccessToken(currentUser.accessToken);
  input.set_AccessTokenSecret(currentUser.accessTokenSecret);
  input.set_ConsumerSecret(common.consumerSecret);
  input.set_ConsumerKey(common.consumerKey);
  return input;
};

common.getColorBySleepTime = function(colors, time){
  var hours = time/60;
  for(var prop in colors){
    if(hours >= colors[prop].min && hours <= colors[prop].max){
      return colors[prop];
    }
  }
  return colors[0];
};

common.getPatternBySteps = function(patterns, steps){
  for(var prop in patterns){
    if(steps >= patterns[prop].min && steps <= patterns[prop].max){
      return patterns[prop];
    }
  }
  return 1;
};

common.getFitbitData = function(date, success, error){
  console.log(common.cache.get("currentUser"));
  if(common.cache.get("currentUser") == null) {
    error("No user found on cache");
    return;
  }
  var _user = common.cache.get("currentUser");
  var _cached = common.cache.get(_user.id + "-" + date);
  if(_cached){
    success(_cached);
    return;
  }
  common.addCredentialsToInput(inputSleep, _user);
  common.addCredentialsToInput(inputActivities, _user);
  inputSleep.set_Date(date);
  inputActivities.set_Date(date);
  var onSuccess = function(data){
    var json = JSON.parse(data.get_Response());
    activities.execute(inputActivities, 
      function(results){
        var json2 = JSON.parse(results.get_Response());
        for(var prop in json2.summary){
          json.summary[prop] = json2.summary[prop];  
        }
        common.cache.put(_user.id + "-" + date, json.summary);
        success(json.summary);
      },
      function(err){ error(err.message); }
    );
  };

  var onError = function(err){
    error(err.message);
  };

  sleep.execute(inputSleep, onSuccess, onError);
};

common.getFitbitDataByRange = function(_start, _end, oncomplete){
   var howmanyDays = common.getDateDifferenceIndays(_start, _end);
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
        callback(null, data);
      }, function(error){
        callback(error, null);
      });
   }
   
   async.map(range, loadData, function(error, results){
      var data = {totalMinutesAsleep:0, veryActiveMinutes:0, sedentaryMinutes:0, 
            fairlyActiveMinutes:0, lightlyActiveMinutes:0, steps:0};
      for(var i = 0; i<results.length; i++){
        if(results[i] == undefined) continue;
        data.totalMinutesAsleep += results[i].totalMinutesAsleep || 400;
        data.veryActiveMinutes += results[i].veryActiveMinutes;
        data.sedentaryMinutes += results[i].sedentaryMinutes;
        data.fairlyActiveMinutes += results[i].fairlyActiveMinutes;
        data.lightlyActiveMinutes += results[i].lightlyActiveMinutes;
        data.steps += results[i].steps;
      }
      data.total = results.length;
      oncomplete(error, data);
   });
};

common.cache = require("memory-cache");
common.session = session;
module.exports = common;
