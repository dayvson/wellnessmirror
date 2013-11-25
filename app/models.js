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

models.ColorScheme = [white, pink, red, orange, yellow, cian, blue];
module.exports = models;