angular.module('musementApp')
.controller('testCtrl', function($scope) {

$scope.notification = false;
$scope.showNotifications=false;
$scope.showUserMenu=false;
$scope.hasTestStarted = true; 

$scope.changeShowNotifications = function(){
  $scope.showNotifications = !$scope.showNotifications;
}

$scope.changeShowMenu = function(){
  $scope.showUserMenu = !$scope.showUserMenu;
}


})
