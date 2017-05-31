angular.module('wetopiaApp')
.service('ideaDataService', function($http) {

  this.getIdeaInformation = function (idea_id, pivot, callback) {
    return $http.get(window.HOST + '/api/ideas/'+ idea_id+'/'+pivot)
    .then(callback)
  }

})
