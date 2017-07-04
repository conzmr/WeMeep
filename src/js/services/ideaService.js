angular.module('wetopiaApp')
.service('ideaDataService', function($http) {

  this.getIdeaInformation = function (idea_id, pivot, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/'+ idea_id+'/'+pivot)
    .then(callback, errorCallback)
  }

  this.updateIdeaInformation = function (idea_id, pivot, newInformation, callback) {
    return $http.put(window.HOST + '/api/ideas/'+ idea_id+'/'+pivot, newInformation)
    .then(callback)
  }

  this.deleteIdea = function (idea_id, pivot, comment, callback, errorCallback) {
    return $http.delete(window.HOST + '/api/ideas/'+ idea_id+'/'+pivot, comment)
    .then(callback, errorCallback)
  }

  this.getAllIdeas = function (callback) {
    return $http.get(window.HOST + '/api/ideas/all')
    .then(callback)
  }

  this.getTrendingIdeas = function (callback) {
    return $http.get(window.HOST + '/api/ideas/trending')
    .then(callback)
  }

  this.getIdeasByCategory = function (category, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/all/category/'+category)
    .then(callback, errorCallback)
  }

  this.getIdeaStats = function (idea_id, pivot_id, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/'+idea_id+'/'+pivot_id+'/stats')
    .then(callback, errorCallback)
  }

  this.giveFeedback = function (idea_id, pivot, text, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/'+pivot+'/feedback', text)
    .then(callback, errorCallback)
  }

  this.deleteFeedback = function (feedback_id, callback, errorCallback){
    return $http.delete(window.HOST + '/api/feedback/'+feedback_id)
    .then(callback, errorCallback)
  }

  this.giveStarToFeedback = function (idea_id, feedback_id, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/'+feedback_id+'/star')
    .then(callback, errorCallback)
  }

  this.giveLike = function (idea_id, pivot_id, like_type, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/'+idea_id+'/'+pivot_id+'/interest', like_type)
    .then(callback, errorCallback)
  }

  this.getLike = function (idea_id, pivot_id, callback, errorCallback) {
    return $http.get(window.HOST + '/api/ideas/'+idea_id+'/'+pivot_id+'/interest')
    .then(callback, errorCallback)
  }

  this.createNewPivot = function (idea_id, pivotInformation, callback, errorCallback) {
    return $http.post(window.HOST + '/api/ideas/this/'+idea_id+'/pivot', pivotInformation)
    .then(callback, errorCallback)
  }

})
