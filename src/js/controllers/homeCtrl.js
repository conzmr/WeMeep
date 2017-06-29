angular.module('wetopiaApp')
.controller('homeCtrl', function($scope, localStorageService, $state, categoriesDataService, ideaDataService, notificationDataService, socket) {

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
}

/**** NOTIFICATIONS SECTION ***/
socket.on('socket', function(socketId){ // client gets the socket event here
  console.log("GET EVENT " + socketId)
  notificationDataService.getSocketInformation(socketId, (response) => {
    if(response.status == 200) console.log("Successfully got socket information")
  })
})

$scope.pushNotification = function(){
  socket.emit('comment', '59401c5fa5631108c32f1691')
  socket.on('notify', () => {
    $scope.notifyMe()
    //call service to create notification at (/notifications)
    //call function to push to notification array or update notification center
  })
}

$scope.notifyMe = function() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification")
  }
  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var options = {
          body: "Someone has commented your idea",
          dir : "ltr"
      }
    var notification = new Notification("New comment", options)
  }
  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var options = {
                body: "message",
                dir : "ltr"
        }
        var notification = new Notification(" Posted a comment")
      }
    })
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother them any more.
}


})
