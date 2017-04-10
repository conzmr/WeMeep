angular.module('musementApp')
    .controller('myIdeaCtrl', function($scope) {
        $scope.pivoting = false;
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.pivots = ['1th Pivot', '2nd Pivot', '3th Pivot'];
        $scope.pivotSelected = $scope.pivots[0];

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

    })
