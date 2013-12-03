var models = {};
models.UserFitBit = function(){
  this.accessToken = null;
  this.accessTokenSecret = null;
  this.id = null;
  this.callbackID = null;
  this.oAuthTokenSecret = null;
};

var white = {color:[255,255,255], min:0, max:0};
var pink = {color:[255,0,255], min:0.1, max:2};
var red = {color:[255,0,0], min:2.1, max:4};
var orange = {color:[255,155,0], min:4.1, max:6};
var yellow = {color:[255,255,0], min:6.1, max:8};
var cian = {color:[0,255,255], min:8.1, max:10};
var blue = {color:[0,0,25], min:10.1, max:24};


var pattern1 = {min:0, max:500, pattern:1};
var pattern2 = {min:501, max:4000, pattern:2};
var pattern3 = {min:4001, max:8000, pattern:3};
var pattern4 = {min:8001, max:10000, pattern:4};
var pattern5 = {min:10001, max:14000, pattern:5};
var pattern6 = {min:14001, max:1400000000, pattern:6};
models.Patterns = [pattern1, pattern2, pattern3, pattern4, pattern6];
models.ColorScheme = [white, pink, red, orange, yellow, cian, blue];
module.exports = models;