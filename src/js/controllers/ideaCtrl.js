angular.module('wetopiaApp')
      .filter('enumeration', function($filter){
        return function(input)
        {
          if(input == null){ return ""; }
          else if(input == 1){
            return input+"st Pivot";
          }
          else if(input == 2){
            return input+"nd Pivot";
          }
          else{
            return input+"th Pivot";
          }
        };
      })
    .controller('ideaCtrl', function($scope, ideaDataService, $state, $filter, $stateParams, categoriesDataService, localStorageService) {
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.like = "";
        $scope.likeFeedback = false;
        $scope.categoriesBanner = categoriesDataService.categories;
        var idea_id= $stateParams.idea_id;
        var user_id = localStorageService.get('user_id');
        $scope.currentUser = {};
        $scope.currentPivot = 1;
        $scope.pivotSelected = $filter('enumeration')($scope.currentPivot);
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');

        $scope.goToIdea = function(idea_id){
          $state.go('idea', {idea_id:idea_id});
          console.log(idea_id);
        }

        $scope.logOut = function(){
          localStorageService.clearAll();
          $state.go('landing');
        }

        $scope.giveStartToFeedback = function(feedback_id){
          ideaDataService.giveStartToFeedback(idea_id, feedback_id, function(response){
            if(response.status==201){
              $scope.getIdea($scope.currentPivot);
            }
          }, function(response){
            switch (response.status) {
              case 400:
                ideaDataService.deleteStartToFeedback(idea_id, feedback_id, function(response){
                  if(response.status==201){
                    $scope.getIdea($scope.currentPivot);
                  }
                })
                break;
            }
          })
        }

        function giveLike(like_type){
          let like = {
            interest: like_type
          }
          ideaDataService.giveLike(idea_id, like, function(response){
            console.log(response);
          })
        }

        $scope.giveFeedback = function(){
          if($scope.newComment){
            let newComment = {
              text : $scope.newComment
            };
            ideaDataService.giveFeedback(idea_id, newComment, function(response){
              $scope.getIdea($scope.currentPivot);
              $scope.newComment = "";
            })
          }
        }

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.data){
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data;
              if($scope.idea.admin._id == user_id){
                $state.go('myIdea', {idea_id:idea_id});
              }
            }
          })
          // ideaDataService.getIdeaStats(idea_id, function(response){
          //   console.log('hed');
          //   console.log(response.status);
          //   console.log(response);
          //   console.log(response.data);
          // })
        }

        $scope.getIdea($scope.currentPivot);

        var getBannerImage = function(category){
          return $scope.categoriesBanner[category].banner;
        }

        $scope.changeLike = function(like){
          if($scope.like==like){
            $scope.like = "";
            $scope.likeFeedback = false;
          }
          else{
            $scope.like = like;
            giveLike(like);
            $scope.likeFeedback = true;
          }
        }

        $scope.logOut = function(){
          localStorageService.clearAll();
          $state.go('landing');
        }

        $scope.changeShowNotifications = function(){
          $scope.showNotifications = !$scope.showNotifications;
        }

        $scope.changeShowMenu = function(){
          $scope.showUserMenu = !$scope.showUserMenu;
        }

        $scope.changeShowPivots = function(){
          $scope.showPivots = !$scope.showPivots;
        }



    })
