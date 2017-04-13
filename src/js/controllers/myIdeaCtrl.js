angular.module('musementApp')
    .controller('myIdeaCtrl', function($scope) {
        $scope.pivoting = false;
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.pivots = ['1st Pivot', '2nd Pivot', '3th Pivot'];
        $scope.pivotSelected = $scope.pivots[0];
        $scope.newPivot=$scope.pivots.length+1;
        $scope.wantToDiscard = false;
        $scope.whyDiscard = false;
        $scope.discarded = false;
        $scope.saved = false;

        $scope.discardIdea = function(){
          $scope.wantToDiscard = false;
          $scope.whyDiscard = true;
        }

        $scope.saveIdea = function(){
          $scope.wantToDiscard=false;
          $scope.saved=true;
        }

        $scope.discardMessage = function(){
          $scope.whyDiscard = false;
          $scope.discarded = true;
        }

        $scope.createPivot = function(){
          $scope.pivoting = true;
          $scope.showPivots =false;
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
