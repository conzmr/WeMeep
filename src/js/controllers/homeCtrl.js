angular.module('wetopiaApp')
.controller('homeCtrl', function($scope, $window, localStorageService, $state, categoriesDataService, ideaDataService, signupDataService) {
$scope.notification = false;
$scope.showNotifications=false;
$scope.showUserMenu=false;
$scope.trending = true;
$scope.allIdeas = false;
$scope.selectedCategory = "";
$scope.currentUser = {};
$scope.currentUser.email = localStorageService.get('email');
$scope.currentUser.username = localStorageService.get('username');
$scope.currentUser.image = localStorageService.get('image');
$scope.categoriesService = categoriesDataService.categories;
$scope.showingIdeas = [];
$scope.recommendedCategories = [];
$scope.welcome = signupDataService.user.isNew;
var initialLimit = 8;
$scope.limitIdeas = initialLimit;
getTrendingIdeas();

$scope.goBack = function(){
  $scope.selectedCategory="";
  getTrendingIdeas();
}

$scope.loadMoreIdeas = function(){
  $scope.limitIdeas+=initialLimit;
}

var getAllIdeas = function(){
  ideaDataService.getAllIdeas(function(response) {
    if(response.data){
      $scope.showingIdeas = response.data.ideas;
    }
  })
}

function getTrendingIdeas(){
  ideaDataService.getTrendingIdeas(function(response) {
    if(response.data){
      $scope.showingIdeas = response.data;
    }
  })
}

var getIdeasByCategory = function(category){
  ideaDataService.getIdeasByCategory(category, function(response) {
    if(response.data){
      $scope.showingIdeas = response.data.ideas;
      getRecommendedCategories();
    }
  })
}

function getRecommendedCategories(){
  categoriesDataService.getRecommendedCategories(function(response){
    if(response.data){
      $scope.recommendedCategories = response.data;
    }
  })
}

$scope.getBannerImage = function(category){
  return $scope.categoriesService[category].banner;
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

$scope.Trending = function(){
  $scope.trending = true;

  $scope.allIdeas = false;
  getTrendingIdeas();
}

// $scope.Recommmended = function(){
//   $scope.trending = false;
//   $scope.recommended = true;
// }

$scope.AllIdeas = function(){
  $scope.trending = false;
  $scope.allIdeas = true;
  getAllIdeas();
}


$scope.selectCategory = function(category, id_name){
  $scope.selectedCategory = category.toUpperCase();
  getIdeasByCategory(id_name);
  // $window.scrollTo(0, 0);
}

$scope.isEllipsisActive = function(e) {
      return (e.offsetWidth < e.scrollWidth);
 }

})
