angular.module('wetopiaApp')
.service('ideaDataService', function($http) {

  this.getIdeaInformation = function (idea_id, pivot, callback) {
    return $http.get(window.HOST + '/api/ideas/'+ idea_id+'/'+pivot)
    .then(callback)
  }

  this.getAllIdeas = function (callback) {
    return $http.get(window.HOST + '/api/ideas/all')
    .then(callback)
  }

  this.getIdeasByCategory = function (category, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/all/'+category)
    .then(callback, errorCallback);
  }

  this.getIdeaStats = function (idea_id, callback) {
    return $http.get(window.HOST + '/api/ideas/'+idea_id+'/stats')
    .then(callback)
  }


})
