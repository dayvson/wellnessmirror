var models = {};
models.UserFitBit = function(){
  this.accessToken = null;
  this.accessTokenSecret = null;
  this.id = null;
  this.callbackID = null;
  this.oAuthTokenSecret = null;
};

var white = {color:[255,255,255], min:0, max:0, state:"not recorded"};
var pink = {color:[255,0,255], min:0.1, max:4, state:"insomniac"};
var red = {color:[255,0,0], min:4.1, max:6, state:"sleepless"};
var orange = {color:[255,20,0], min:6.1, max:7, state:"tired"};
var yellow = {color:[255,200,0], min:7.1, max:8.5, state:"rested"};
var cian = {color:[0,255,255], min:8.5, max:9.5, state:"well slept"};
var blue = {color:[0,0,255], min:9.5, max:24, state:"drowsy"};

var pattern1 = {min:0, max:500, pattern:1, state:"not recorded"};
var pattern2 = {min:501, max:4000, pattern:2, state:"sedentary"};
var pattern3 = {min:4001, max:6000, pattern:3, state:"lazy"};
var pattern4 = {min:6001, max:9000, pattern:4, state:"active"};
var pattern5 = {min:9001, max:14000, pattern:5, state:"vigorous"};
var pattern6 = {min:14001, max:1400000000, pattern:6, state:"hyperactive"};

models.Patterns = [pattern1, pattern2, pattern3, pattern4, pattern6];
models.ColorScheme = [white, pink, red, orange, yellow, cian, blue];
module.exports = models;