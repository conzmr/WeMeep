angular.module('musementApp')
.service('createIdeaDataService', function($http) {

  this.setIdea = function(idea, user_id, callback, errCallback) {
    $http.post(window.HOST + '/api/users/' + user_id + '/ideas', idea)
    .then(callback, errCallback);
  }

  // this.getProject = function (project_id, callback) {
  //   $http.get(window.HOST + '/api/projects/' + project_id)
  //   .then(callback)
  // }
  //
  // this.getProjectMoments = function (project_id, callback) {
  //   $http.get(window.HOST + '/api/projects/' + project_id+'/moments')
  //   .then(callback)
  // }
  //
  // this.getUsernameProject = function(username, project, callback) {
  //   $http.get(window.HOST + '/api/users/u=' + username + '/p=' + project)
  //   .then(callback)
  // }

})
