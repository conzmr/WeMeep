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
        $scope.interestShowed = false;
        $scope.likeFeedback = false;
        $scope.categoriesBanner = categoriesDataService.categories;
        var idea_id= $stateParams.idea_id;
        var user_id = localStorageService.get('user_id');
        $scope.currentUser = {};
        $scope.currentPivot = 1;
        var currentComment = "";
        var commentIndex = "";
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');

        $scope.logOut = function(){
          localStorageService.clearAll();
          $state.go('landing');
        }

        $scope.wantoToDeleteFeedback = function(comment_id, index){
          $scope.wantToDeleteComment = true;
          currentComment = comment_id;
          commentIndex = index;
        }

        $scope.deleteFeedback = function(){
          ideaDataService.deleteFeedback(currentComment, function(response){
            if(response.status==200){
              $scope.pivot.feedback.splice(commentIndex, 1);
            }
          })
          $scope.wantToDeleteComment = false;
          $scope.deletedComment = true;
        }

        $scope.giveStarToFeedback = function(feedback_id, index){
          ideaDataService.giveStarToFeedback(idea_id, feedback_id, function(response){
            if(response.status==201){
              $scope.pivot.feedback[index].stars.push(response.data);
            }
          }, function(response){
            switch (response.status) {
              case 400:
                ideaDataService.deleteStarToFeedback(idea_id, feedback_id, function(response){
                  if(response.status==201){
                      $scope.pivot.feedback[index].stars.splice(commentIndex, 1);
                  }
                })
                break;
            }
          })
        }

        function getLike(){
          ideaDataService.giveLike(idea_id, $scope.currentPivot, function(response){
            console.log(response);
          })
        }

        $scope.giveLike =function(){
          let like = {
            interest: $scope.like,
            comment: $scope.whyInterest
          }
          ideaDataService.giveLike(idea_id, $scope.currentPivot, like, function(response){
            if(response.status == 200){
              $scope.likeFeedback = false;
              $scope.interestShowed = true;
            }
          })
        }

        $scope.giveFeedback = function(){
          if($scope.newComment){
            let newComment = {
              text : $scope.newComment
            };
            ideaDataService.giveFeedback(idea_id, $scope.currentPivot, newComment, function(response){
              $scope.pivot.feedback.push(response.data.feedback);
              $scope.newComment = "";
            })
          }
        }

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.data){
              console.log(response.data.pivot);
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data.idea;
              $scope.pivot = response.data.pivot;
              $scope.pivotSelected = $filter('enumeration')(pivotNumber);
              if($scope.idea.admin._id == user_id){
                $state.go('myIdea', {idea_id:idea_id});
              }
            }
            else{
              $state.go('home');
            }
          })
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
