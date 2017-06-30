angular.module('wetopiaApp')
.service('notificationDataService', function($http) {

  this.getSocketInformation = function (socketId, callback, errorCallback) {
    $http.get(window.HOST + '/api/socket/' + socketId)
    .then(callback, errorCallback)
  }

})
