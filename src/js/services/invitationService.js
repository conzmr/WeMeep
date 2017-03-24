angular.module('musementApp')
.service('invitationDataService', function($http) {

  this.invitation = function (invitationInfo, callback, errorCallback) {
    $http.post(window.HOST + '/api/invitation', invitationInfo)
    .then(callback,errorCallback)
  }

});
