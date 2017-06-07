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
    return $http.get(window.HOST + '/api/ideas/all/category/'+category)
    .then(callback, errorCallback);
  }

  this.getIdeaStats = function (idea_id, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/'+idea_id+'/stats')
    .then(callback, errorCallback)
  }

  this.giveFeedback = function (idea_id, text, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/feedback', text)
    .then(callback, errorCallback)
  }

  this.giveStartToFeedback = function (idea_id, feedback_id, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/'+feedback_id+'/star')
    .then(callback, errorCallback)
  }

  this.giveLike = function (idea_id, like_type, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/interest', like_type)
    .then(callback, errorCallback)
  }

})
