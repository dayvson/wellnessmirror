var request = require("request");
var ArduinoProxy = {
  host:"http://128.122.98.12",
};

ArduinoProxy.sendOverall = function(color, pattern){
  request.get(ArduinoProxy.host + "/data/put/r/" + color[0]);
  request.get(ArduinoProxy.host + "/data/put/g/" + color[1]);
  request.get(ArduinoProxy.host + "/data/put/b/" + color[2]);
  request.get(ArduinoProxy.host + "/data/put/pattern/" + pattern);
  request.get(ArduinoProxy.host + "/data/put/mode/1"); //overall
  return true;
};

ArduinoProxy.sendActivities = function(activities){
  //222*100/(490+222+167+6)
  request.get(ArduinoProxy.host + "/data/put/sleep_time/" + activities.sleep);
  request.get(ArduinoProxy.host + "/data/put/very_active/" + activities.veryActiveMinutes);
  request.get(ArduinoProxy.host + "/data/put/sendentary/" + activities.sedentaryMinutes);
  request.get(ArduinoProxy.host + "/data/put/fairly_active/" + activities.fairlyActiveMinutes);
  request.get(ArduinoProxy.host + "/data/put/lightly_active/" + activities.lightlyActiveMinutes);
  request.get(ArduinoProxy.host + "/data/put/mode/2"); //stats
};


module.exports = ArduinoProxy;