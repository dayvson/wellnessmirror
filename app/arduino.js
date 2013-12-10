var request = require("request");
var ArduinoProxy = {
  host:"http://128.122.98.12",
};

ArduinoProxy.sendOverall = function(color, pattern){
  try{
  request.get(ArduinoProxy.host + "/data/put/r/" + color[0]);
  request.get(ArduinoProxy.host + "/data/put/g/" + color[1]);
  request.get(ArduinoProxy.host + "/data/put/b/" + color[2]);
  request.get(ArduinoProxy.host + "/data/put/pattern/" + pattern);
  request.get(ArduinoProxy.host + "/data/put/mode/2"); //overall
  }catch(e){};
  return true;
};

ArduinoProxy.sendActivities = function(activities){
  try{
  request.get(ArduinoProxy.host + "/data/put/sleep_time/" + activities.sleepTime);
  request.get(ArduinoProxy.host + "/data/put/very_active/" + activities.veryActive);
  request.get(ArduinoProxy.host + "/data/put/sendentary/" + activities.sedentary);
  request.get(ArduinoProxy.host + "/data/put/fairly_active/" + activities.fairly);
  request.get(ArduinoProxy.host + "/data/put/lightly_active/" + activities.lightly);
  request.get(ArduinoProxy.host + "/data/put/mode/1"); //stats
  }catch(e){};
};


module.exports = ArduinoProxy;