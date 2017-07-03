angular.module('wetopiaApp')
.service('signupDataService', function($http) {
  this.user = {};

  this.signup = function (signupInfo, callback, errorCallback) {
    $http.post(window.HOST + '/api/signup', signupInfo)
    .then(callback,errorCallback)
  }

});
