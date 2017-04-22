angular.module('musementApp')
.service('signupDataService', function($http) {

  this.signup = function (signupInfo, callback, errorCallback) {
    $http.post(window.HOST + '/api/signup', signupInfo)
    .then(callback,errorCallback)
  }

});
