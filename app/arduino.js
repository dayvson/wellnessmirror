var request = require("request");
var ArduinoProxy = {
  host:"http://128.122.98.12",
};

ArduinoProxy.sendOverall = function(color, pattern){
  request.get(ArduinoProxy.host + "/data/put/r/" + color[0]);
  request.get(ArduinoProxy.host + "/data/put/g/" + color[1]);
  request.get(ArduinoProxy.host + "/data/put/b/" + color[2]);
  request.get(ArduinoProxy.host + "/data/put/pattern/" + pattern);
  request.get(ArduinoProxy.host + "/data/put/mode/2"); //overall
  return true;
};

ArduinoProxy.sendActivities = function(activities){
  //222*100/(490+222+167+6)
  var total = activities.sleep + activities.veryActiveMinutes + activities.sedentaryMinutes + activities.fairlyActiveMinutes + activities.lightlyActiveMinutes;
  var sleepTime = Math.max(1,Math.ceil(activities.sleep*100/total));
  var veryActive = Math.max(1,Math.ceil(activities.veryActiveMinutes*100/total));
  var sedentary = Math.max(1,Math.ceil(activities.sedentaryMinutes*100/total))-2;
  var fairly = Math.max(1,Math.ceil(activities.fairlyActiveMinutes*100/total));
  var lightly = Math.max(1, Math.ceil(activities.lightlyActiveMinutes*100/total));
  console.log("###################################################");
  console.log("SLEEPTIME", sleepTime);
  console.log("VERY ACTIVE", veryActive);
  console.log("SEDENTARY", sedentary);
  console.log("FAIRLY", fairly);
  console.log("LIGHTLY", lightly);
  console.log("TOTAL", sleepTime+ veryActive + sedentary + fairly + lightly);
  console.log("###################################################");
  request.get(ArduinoProxy.host + "/data/put/sleep_time/" + sleepTime);
  request.get(ArduinoProxy.host + "/data/put/very_active/" + veryActive);
  request.get(ArduinoProxy.host + "/data/put/sendentary/" + sedentary);
  request.get(ArduinoProxy.host + "/data/put/fairly_active/" + fairly);
  request.get(ArduinoProxy.host + "/data/put/lightly_active/" + lightly);
  request.get(ArduinoProxy.host + "/data/put/mode/1"); //stats
};


module.exports = ArduinoProxy;