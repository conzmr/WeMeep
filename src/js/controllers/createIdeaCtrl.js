angular.module('musementApp')
    .controller('createIdeaCtrl', function($scope, $rootScope, $stateParams, createIdeaDataService, localStorageService, $http, Upload, $state) {

      let user_id = localStorageService.get('user_id');
      $scope.idea = {};
      $scope.mySwitch = false;
      $scope.inputTeamMembers = false;
      $scope.tags = []


      // Load categories when creating a moment
      $scope.loadTags = function($query) {
        return $http.get(HOST + '/api/tags',{cache: true}).then(function(response) {
          var tags = response.data;
          return tags.filter(function(tag) {
            return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
          })
        })
      }

      $scope.createIdea = function() {
        if (this.idea.banner == undefined) {
           $scope.sumbitIdea("/static/img/cover_Login.svg")
        }else if (this.idea.banner.type) {
          $scope.upload(this.idea.banner)
        }

      }

      $scope.upload = function(file){
        if (!file) { //If user doesnt want to upload a photo, set the gravatar one
            $scope.submitIdea(); //Send no image
        } else {
          Upload.upload({url: window.HOST + '/api/upload', data:{ file: file }})
          .then(function (res) { //upload function returns a promise
                $scope.submitIdea('/static/uploads/' + res.data.file_name);
            }, function (errRes) { //catch error
                $window.alert('Error status: ' + errRes.status);
          });
        }
      }

      $scope.submitIdea = function (banner) {
        console.log("sumbitIdea Execute");
        let ideaInfo = {};
        ideaInfo.name = this.idea.name
        ideaInfo.description = this.idea.description
        ideaInfo.categories = this.idea.categories
        ideaInfo.problem = this.idea.problem
        ideaInfo.banner = banner

        createIdeaDataService.setIdea(ideaInfo, user_id, function(res){
          if (res.status == 201) {
            // $scope.this_user.ideas.push(res.data.idea)
            $state.go('showIdea')
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
