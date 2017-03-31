angular.module('musementApp')
.controller('homeCtrl', function($scope) {

$scope.notification = false;
$scope.showNotifications=false;
$scope.showUserMenu=false;
$scope.trending = true;
$scope.recommended = false;
$scope.selectedCategory = "";

$scope.changeShowNotifications = function(){
  $scope.showNotifications = !$scope.showNotifications;
}

$scope.changeShowMenu = function(){
  $scope.showUserMenu = !$scope.showUserMenu;
}

$scope.Trending = function(){
  $scope.trending = true;
  $scope.recommended = false;
}

$scope.Recommmended = function(){
  $scope.trending = false;
  $scope.recommended = true;
}

$scope.categories = [{
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
},{
  name: 'Film & Fotography',
  cover: '/static/img/CATEGORIES_ICONS/FILM_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FILM_ICON.svg'
},{
  name: 'Finances',
  cover: '/static/img/CATEGORIES_ICONS/FINAN_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FINAN_ICON.svg'
},{
  name: 'Food',
  cover: '/static/img/CATEGORIES_ICONS/FOOD_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/FOOD_ICON.svg'
},{
  name: 'Games',
  cover: '/static/img/CATEGORIES_ICONS/GAMES_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/GAMES_ICON.svg'
},{
  name: 'Hand Craft',
  cover: '/static/img/CATEGORIES_ICONS/HC_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/HC_ICON.svg'
},{
  name: 'Health',
  cover: '/static/img/CATEGORIES_ICONS/HEALTH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/HEALTH_ICON.svg'
},{
  name: 'Social',
  cover: '/static/img/CATEGORIES_ICONS/SOCIAL_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/SOCIAL_ICON.svg'
},{
  name: 'Technological',
  cover: '/static/img/CATEGORIES_ICONS/TECH_ICON.svg',
  hover:'/static/img/CATEGORIES_ICONS/HOVER/TECH_ICON.svg'
},{
  name: 'Others',
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

$scope.selecCategory = function(category){
  $scope.selectedCategory = category.toUpperCase();
}

})
