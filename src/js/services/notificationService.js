angular.module('wetopiaApp')
.service('notificationDataService', function($http) {

  this.getSocketInformation = function (socketId, callback, errorCallback) {
    return $http.get(window.HOST + '/api/socket/' + socketId)
    .then(callback, errorCallback)
  }

  this.createNewNotification = function (notification, callback, errorCallback) {
    return $http.post(window.HOST + '/api/notifications/', notification)
    .then(callback, errorCallback)
  }

  this.getNotifications = function (callback, errorCallback) {
    return $http.get(window.HOST + '/api/notifications/')
    .then(callback, errorCallback)
  }

  this.seenTrueNotifications = function (notification, callback, errorCallback) {
    return $http.put(window.HOST + '/api/notifications/', notification)
    .then(callback, errorCallback)
  }

})
