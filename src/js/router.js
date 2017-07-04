angular.module('wetopiaApp')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
            .state("landing", {
                url: "/",
                controller: "landingCtrl",
                templateUrl: "/static/views/wetopiaLanding.html",
                authenticate: false, //Doesn't requires authentication
                onEnter: function(localStorageService, $state){
                  let auth = true
                  var token = localStorageService.get('token') //Get token
                  if(token){
                  //Check that the token is valid, time interval
                  var params = self.parseJwt(token)
                  if (!(Math.round(new Date().getTime() / 1000) <= params.exp)) auth = false
                  if (token && auth) {
                    $state.go('home')
                    event.preventDefault()
                  }
                  }
                }
            })
            .state("landingAction", {
                url: "/sign/:actionParam",
                controller: "landingCtrl",
                templateUrl: "/static/views/wetopiaLanding.html",
                authenticate: false //Doesn't requires authentication
            })
            .state("home", {
                url: "/home",
                controller: "homeCtrl",
                templateUrl: "/static/views/home.html",
                authenticate: true
            })
            .state("myIdea", {
                url: "/idea/:idea_id/:pivotNumber",
                params: {
                  pivotNumber: 1+"",  // default value of x is 5
                    },
                controller: "myIdeaCtrl",
                templateUrl: "/static/views/myIdea.html",
                authenticate: true
            })
            .state("idea", {
                url: "/idea/:idea_id/:pivotNumber",
                params: {
                  pivotNumber: 1+"",  // default value of x is 5
                    },
                controller: "ideaCtrl",
                templateUrl: "/static/views/idea.html",
                authenticate: true
            })
            .state("createIdea", {
                url: "/createIdea",
                controller: "createIdeaCtrl",
                templateUrl: "/static/views/createIdea.html",
                authenticate: true
            })
            .state("createIdea.first", {
                url: "/first",
                // controller: "createIdeaCtrl",
                templateUrl: "/static/views/createIdeaS1.html",
                authenticate: true
            })
            .state("createIdea.second", {
                url: "/second",
                // controller: "createIdeaCtrl",
                templateUrl: "/static/views/createIdeaS2.html",
                authenticate: true, //mover
                data: {
                    redirect: ['createIdeaDataService', function(createIdeaDataService) {
                        // just check that firstName is in, if not return the state where this is filled
                        if (!createIdeaDataService.idea.name) {
                            return 'createIdea.first';
                        }
                    }]
                }
            })
            .state("myProfile", {
                url: "/myProfile",
                  authenticate: true,
                  controller: "myProfileCtrl",
                  templateUrl: "/static/views/myProfile.html"
            })
            .state("myProfileSection", {
                url: "/myProfile/:section",
                  authenticate: true,
                  controller: "myProfileCtrl",
                  templateUrl: "/static/views/myProfile.html"
            })
            .state("profileSection", {
                url: "/profile/:username/:section",
                  authenticate: true,
                  controller: "profileCtrl",
                  templateUrl: "/static/views/profile.html",
                  onEnter: function(localStorageService,  $stateParams, $state){
                  if(localStorageService.get('username')==$stateParams.username){
                     $state.go('myProfileSection', {section: $stateParams.section});
                     event.preventDefault();
                   }
                }
                //CHEK THIS
            })
            .state("profile", {
                url: "/profile/:username",
                controller: "profileCtrl",
                templateUrl: "/static/views/profile.html",
                authenticate: true,
               onEnter: function(localStorageService,  $stateParams, $state){
               if(localStorageService.get('username')==$stateParams.username){
                  $state.go('myProfile');
                  event.preventDefault();
                }
             }
            })
            .state("goProfileSection", {
                url: "/profile/:username/:section",
                controller: "myIdeaCtrl",
                templateUrl: "/static/views/myIdea.html",
                authenticate: true
            })
            .state("test", {
                url: "/test",
                controller: "testCtrl",
                templateUrl: "/static/views/test.html",
                authenticate: true
            })
            .state("file", {
                url: "/B82F78012D19096C9C02329214B6873A.txt",
                controller: function($http){
                    return $http.get(HOST + '/api/download-file', {
                        cache: true
                    }).then(function(response) {
                        console.log(response);
                    });
                },
                templateUrl: "/static/B82F78012D19096C9C02329214B6873A.txt",
                authenticate: false //Doesn't requires authentication
            })


        // Send to landingpage if the URL was not found
        $urlRouterProvider.otherwise('home');

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
            if (!token) { //If token == nil
                return false
            } else { //Check that the token is valid, time interval
                var params = self.parseJwt(token);
                if (!(Math.round(new Date().getTime() / 1000) <= params.exp)) {
                    console.log('Invalid token');
                }
                return (Math.round(new Date().getTime() / 1000) <= params.exp);
            }
        };
    })

//Run service to check the token is valid
.run(function($rootScope, $state, AuthService,  $window, $injector, $anchorScroll) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
       $window.scrollTo(0, 0);
        if (toState.authenticate && !AuthService.isAuthenticated()) { // User isn’t authenticated
            $state.transitionTo("landing"); //If it's not valid redirect to login
            event.preventDefault();
        }
        if (toState.data && toState.data.redirect) {
            var redirectTo = $injector.invoke(toState.data.redirect);
            if (redirectTo) {
                $state.go(redirectTo);
                event.preventDefault();
            }
        }
        if (toState.verify && toState.verify.redirect) {
            var redirectTo = $injector.invoke(toState.verify.redirect);
            if (redirectTo) {
                $state.go(redirectTo);
                event.preventDefault();
            }
        }
    });
});
