angular.module('wetopiaApp')
.service('ideaDataService', function($http) {

  this.getIdeaInformation = function (idea_id, callback) {
    $http.get(window.HOST + '/api/ideas/self/'+ idea_id)
    .then(callback)
  }

})
