angular.module('wetopiaApp')
    .service('createIdeaDataService', function($http) {

        this.idea = {};

        this.setIdea = function(callback, errorCallback) {
           $http.post(window.HOST + '/api/ideas/self/create', this.idea)
              .then(callback, errorCallback)
        };

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
