angular.module('wetopiaApp')
.controller('homeCtrl', function($scope, localStorageService, $state, categoriesDataService, ideaDataService) {

$scope.notification = false;
$scope.showNotifications=false;
$scope.showUserMenu=false;
$scope.trending = true;
$scope.allIdeas = false;
$scope.selectedCategory = "";
$scope.currentUser = {};
$scope.currentUser.email = localStorageService.get('email');
$scope.currentUser.username = localStorageService.get('username');
$scope.categoriesBanner = categoriesDataService.categories;
var allIdeasContainer = [];
$scope.showingIdeas = [];
var initialLimit = 8;
$scope.limitIdeas = initialLimit;

$scope.loadMoreIdeas = function(){
  $scope.limitIdeas+=initialLimit;
}

var getAllIdeas = function(){
  ideaDataService.getAllIdeas(function(response) {
    if(response.data){
      allIdeasContainer = response.data.ideas;
    }
  })
}

var getIdeasByCategory = function(category){
  ideaDataService.getIdeasByCategory(category, function(response) {
    if(response.data){
      console.log(response.data);
      console.log(response.status);
      console.log("MI data"+response.data);
      $scope.showingIdeas = response.data.ideas;
    }
  })
}

getAllIdeas();

$scope.getBannerImage = function(category){
  return $scope.categoriesBanner[category].banner;
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
}

// $scope.Recommmended = function(){
//   $scope.trending = false;
//   $scope.recommended = true;
// }

$scope.AllIdeas = function(){
  $scope.trending = false;
  $scope.allIdeas = true;
  $scope.showingIdeas = allIdeasContainer;
}

$scope.categories = [{
  name: 'Art',
  id_name: 'art',
  cover: '/static/img/CATEGORIES_ICONS/ART_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/ART_ICON.svg'
},{
  name: 'Design',
  id_name: 'design',
  cover: '/static/img/CATEGORIES_ICONS/DESIGN_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/DESIGN_ICON.svg'
},{
  name: 'Ecological',
  id_name: 'ecological',
  cover: '/static/img/CATEGORIES_ICONS/ECO_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/ECO_ICON.svg'
},{
  name: 'Education',
  id_name: 'education',
  cover: '/static/img/CATEGORIES_ICONS/EDU_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/EDU_ICON.svg'
},{
  name: 'Fashion',
  id_name: 'fashion',
  cover: '/static/img/CATEGORIES_ICONS/FASH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FASH_ICON.svg'
},{
  name: 'Film & Fotography',
  id_name: 'film',
  cover: '/static/img/CATEGORIES_ICONS/FILM_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FILM_ICON.svg'
},{
  name: 'Finances',
  id_name: 'finances',
  cover: '/static/img/CATEGORIES_ICONS/FINAN_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FINAN_ICON.svg'
},{
  name: 'Food',
  id_name: 'food',
  cover: '/static/img/CATEGORIES_ICONS/FOOD_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FOOD_ICON.svg'
},{
  name: 'Games',
  id_name: 'games',
  cover: '/static/img/CATEGORIES_ICONS/GAMES_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/GAMES_ICON.svg'
},{
  name: 'Hand Craft',
  id_name: 'handcraft',
  cover: '/static/img/CATEGORIES_ICONS/HC_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/HC_ICON.svg'
},{
  name: 'Health',
  id_name: 'health',
  cover: '/static/img/CATEGORIES_ICONS/HEALTH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/HEALTH_ICON.svg'
},{
  name: 'Social',
  id_name: 'social',
  cover: '/static/img/CATEGORIES_ICONS/SOCIAL_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/SOCIAL_ICON.svg'
},{
  name: 'Technological',
  id_name: 'technological',
  cover: '/static/img/CATEGORIES_ICONS/TECH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/TECH_ICON.svg'
},{
  name: 'Others',
  id_name: 'others',
  cover: '/static/img/CATEGORIES_ICONS/OTHERS_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/OTHERS_ICON.svg'
}
];

$scope.otherCategories = [{
  name: 'Art',
  cover: '/static/img/CATEGORIES_ICONS/ART_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/ART_ICON.svg'
},{
  name: 'Design',
  cover: '/static/img/CATEGORIES_ICONS/DESIGN_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/DESIGN_ICON.svg'
},{
  name: 'Ecological',
  cover: '/static/img/CATEGORIES_ICONS/ECO_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/ECO_ICON.svg'
},{
  name: 'Education',
  cover: '/static/img/CATEGORIES_ICONS/EDU_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/EDU_ICON.svg'
},{
  name: 'Fashion',
  cover: '/static/img/CATEGORIES_ICONS/FASH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FASH_ICON.svg'
}];

$scope.selectCategory = function(category, id_name){
  $scope.selectedCategory = category.toUpperCase();
  getIdeasByCategory(id_name);
}

})
