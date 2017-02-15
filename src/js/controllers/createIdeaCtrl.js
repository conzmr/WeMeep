angular.module('musementApp')
    .controller('createIdeaCtrl', function($scope, $rootScope, $stateParams, createIdeaDataService, localStorageService, $http, Upload, $state) {

      let user_id = localStorageService.get('user_id');
      $scope.idea = {};
      $scope.mySwitch = false;
      $scope.inputTeamMembers = false;

      $scope.submitIdea = function () {
        console.log("sumbitIdea Execute");
        let ideaInfo = {};
        ideaInfo.name = this.idea.name
        ideaInfo.description = this.idea.description
        ideaInfo.categories = this.idea.categories
        ideaInfo.problem = this.idea.problem
        // ideaInfo.cover = cover

        createIdeaDataService.setIdea(ideaInfo, user_id, function(res){
          if (res.status == 201) {
            // $scope.this_user.ideas.push(res.data.idea)
            $state.go('home')
          }
        });
      }
  })
  /*
  function getMemberName() {
      var input, filter, ul, li, p, i;
      input = document.getElementById("name-member-input");
      filter = input.value.toUpperCase();
      ul = document.getElementById("members-list");
      li = ul.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
          p = li[i].getElementsByTagName("p")[0].innerHTML + li[i].getElementsByTagName("p")[1].innerHTML;
          if (p.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
          } else {
              li[i].style.display = "none";

          }
      }
  }
  */
