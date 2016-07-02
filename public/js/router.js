angular.module('musementApp')
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
      .state("landing", {
        url: "/",
        templateUrl: "/static/views/landingpage.html",
        authenticate: false //Doesn't requires authentication
      })
      .state("feed", {
        templateUrl: "/static/views/feed.html",
        controller: "feedCtrl",
        authenticate: false //Does require authentication
      })
      .state("signup", {
        url: "/signup",
        templateUrl: "/static/views/signup.html",
        authenticate: false //Doesn't requires authentication
      })
      .state("signin", {
        url: "/signin",
        templateUrl: "/static/views/signin.html",
        authenticate: false //Doesn't requires authentication
      })
      .state("feed.connections", {
        url: "/connections",
        templateUrl: "/static/views/feed.connections.html",
        authenticate: false //Doesn't requires authentication
      })
      .state("feed.project", {
        url: "/project/:name",
        controller: "projectCtrl",
        templateUrl: "/static/views/feed.project.html",
        authenticate: false //Doesn't requires authentication
      })

    // Send to login if the URL was not found
    $urlRouterProvider.otherwise("/");

    // delete the # in the url
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

})
//Authentication service
.service('AuthService', function(localStorageService, $window) {
  //Functino to parse JWT and decode it
  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  this.isAuthenticated = function() {
    var token = localStorageService.get('token'); //Get token
    if(!token) { //If token == nil
      return false
    } else { //Check that the token is valid, time interval
      var params = self.parseJwt(token);
      if(!(Math.round(new Date().getTime() / 1000) <= params.exp)) {
        console.log('Invalid token');
      }
      return (Math.round(new Date().getTime() / 1000) <= params.exp);
    }
  };
})

//Run service to check the token is valid
.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !AuthService.isAuthenticated()){ // User isn’t authenticated
      $state.transitionTo("landing"); //If it's not valid redirect to login
      event.preventDefault();
    }
  });
});
