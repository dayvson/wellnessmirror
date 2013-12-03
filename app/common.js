var tsession = require("temboo/core/temboosession");
var common = {
  consumerKey: "246396abf6cf4585a78c6ab24f335901",
  consumerSecret: "65be4a7e054b4972ae3542a5e35f2387",
  userAccount:"dayvson", 
  appName:"wellnessmirror", 
  appKey:"a07807fe-bd06-4dca-8",
  forwardURL:"http://localhost:8080/credentials",
	getDateDifferenceIndays: function(startDateStr, endDateStr){
    var startDate = new Date(startDateStr + " 00:00:00");
    var endDate = new Date(endDateStr + " 00:00:00");
    var diff = endDate - startDate;
    var dayinMillis = 86400000;
    return Math.floor(diff/dayinMillis);
	},
  addCredentialsToInput: function(input, currentUser){
    input.set_UserID(currentUser.id);
    input.set_AccessToken(currentUser.accessToken);
    input.set_AccessTokenSecret(currentUser.accessTokenSecret);
    input.set_ConsumerSecret(common.consumerSecret);
    input.set_ConsumerKey(common.consumerKey);
    return input;
  },
  getColorBySleepTime: function(colors, time){
    var hours = time/60;
    for(var prop in colors){
      if(hours >= colors[prop].min && hours <= colors[prop].max){
        return colors[prop].color;
      }
    }
  }, 
  getPatternBySteps: function(patterns, steps){
    for(var prop in patterns){
      if(steps >= patterns[prop].min && steps <= patterns[prop].max){
        return patterns[prop].pattern;
      }
    }
    return 1;
  }
};
common.cache = require("memory-cache");
common.session = new tsession.TembooSession(common.userAccount, common.appName, common.appKey);
module.exports = common;
