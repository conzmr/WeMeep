angular.module('musementApp')
    .controller('ideaCtrl', function($scope) {
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.pivots = ['1st Pivot', '2nd Pivot', '3th Pivot'];
        $scope.pivotSelected = $scope.pivots[0];
        $scope.like = "";
        $scope.likeFeedback = false;

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

        $scope.changeShowNotifications = function(){
          $scope.showNotifications = !$scope.showNotifications;
        }

        $scope.changeShowMenu = function(){
          $scope.showUserMenu = !$scope.showUserMenu;
        }

        $scope.selectPivot = function(pivot){
          $scope.pivotSelected = pivot;
          $scope.showPivots = false;
        }

        $scope.changeShowPivots = function(){
          $scope.showPivots = !$scope.showPivots;
        }

        $scope.feedback = [{
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 12,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 7,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 2,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 0,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 8,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        }
      ]

    })
