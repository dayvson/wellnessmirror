var FitbitActivities = require("temboo/Library/Fitbit/Activities");
var FitbitSleep = require("temboo/Library/Fitbit/Sleep");
var tsession = require("temboo/core/temboosession");
var common = {
  consumerKey: "246396abf6cf4585a78c6ab24f335901",
  consumerSecret: "65be4a7e054b4972ae3542a5e35f2387",
  userAccount:"dayvson", 
  appName:"wellnessmirror", 
  appKey:"a07807fe-bd06-4dca-8",
  forwardURL:"http://localhost:8080/credentials"
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
  if(common.cache.get("currentUser") == null) error("No user found on cache");
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

common.cache = require("memory-cache");
common.session = session;
module.exports = common;
