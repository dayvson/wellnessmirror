module.exports = function(app){
  var common = require(__dirname + "/common");
  var Fitbit = require("temboo/Library/Fitbit/OAuth");
  var models = require(__dirname + "/models");
  var finalizeOAuth = new Fitbit.FinalizeOAuth(common.session);
  var initializeOAuth = new Fitbit.InitializeOAuth(common.session);
  var finalizeOAuthInputs = finalizeOAuth.newInputSet();
  var initializeOAuthInputs = initializeOAuth.newInputSet();
  initializeOAuthInputs.set_ConsumerSecret(common.consumerSecret);
  initializeOAuthInputs.set_ForwardingURL("http://localhost:3000/credentials");
  initializeOAuthInputs.set_ConsumerKey(common.consumerKey);
  var finishAuthentication = function(req, res, next){
  
    var currentUser = common.cache.get("currentUser");
    if(currentUser.callbackID == null){
      res.redirect("/login");
      return;
    }
    finalizeOAuthInputs.set_CallbackID(currentUser.callbackID);
    finalizeOAuthInputs.set_OAuthTokenSecret(currentUser.oAuthTokenSecret);
    finalizeOAuthInputs.set_ConsumerSecret(common.consumerSecret);
    finalizeOAuthInputs.set_ConsumerKey(common.consumerKey);
    var onAuthComplete = function(results){
      currentUser.accessTokenSecret = results.get_AccessTokenSecret();
      currentUser.accessToken = results.get_AccessToken();
      currentUser.id = results.get_UserID();
      common.cache.put("currentUser", currentUser);
      res.redirect("/index");
    };
    var onAuthError = function(error){
      res.send("ERROR on Authorization");
    };
    finalizeOAuth.execute(
        finalizeOAuthInputs,
        onAuthComplete,
        onAuthError
    );
  };


  var initAuthentication = function(req, res, next){
    initializeOAuth.execute(
        initializeOAuthInputs,
        function(results){
          var currentUser = new models.UserFitBit();
          currentUser.callbackID = results.get_CallbackID();
          currentUser.oAuthTokenSecret = results.get_OAuthTokenSecret();
          common.cache.put("currentUser", currentUser);
          res.redirect(results.get_AuthorizationURL());
        },
        function(error){console.log(error.type);
         console.log(error.message);
         res.send("ERROR");
       }
    );
  };

  var renderLogin = function(req, res, next){
    res.render("login");
  };

  app.get("/login", renderLogin);
  app.get("/credentials", finishAuthentication);
  app.get("/oauth", initAuthentication);
};