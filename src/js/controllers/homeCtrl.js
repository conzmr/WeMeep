angular.module('wetopiaApp')
.controller('homeCtrl', function($scope, $window, localStorageService, $state, $filter, categoriesDataService, ideaDataService, signupDataService, notificationDataService, socket) {
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
$scope.currentUser.id = localStorageService.get('user_id');
$scope.currentUser.name = localStorageService.get('name');
$scope.currentUser.notifications = [];
$scope.categoriesService = categoriesDataService.categories;
$scope.showingIdeas = [];
$scope.recommendedCategories = [];
$scope.welcome = signupDataService.user.isNew;
var initialLimit = 8;
$scope.limitIdeas = initialLimit;
getTrendingIdeas();
getNotifications();

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
  if($scope.showNotifications && $scope.notification){
    for(var i=0; i<$scope.currentUser.notifications.length; i++){
      if(!$scope.currentUser.notifications[i].seen){
        seeNotifications($scope.currentUser.notifications[i]._id);
      }
    }
    $scope.notification=false;
  }
}

function seeNotifications(notification_id){
  let notification ={
    id: notification_id
  }
  notificationDataService.seenTrueNotifications(notification, function(response){
  })
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

function getNotifications(){
  notificationDataService.getNotifications(function(response){
    if(response.data['new notification']){
      $scope.notification = true;
    }
    $scope.currentUser.notifications = response.data.notifications;
  })
}


/**** NOTIFICATIONS SECTION ***/
socket.on('socket', function(socketId){ // client gets the socket event here
  console.log("GET EVENT " + socketId)
  notificationDataService.getSocketInformation(socketId, (response) => {
    if(response.status == 200) console.log("Successfully got socket information")
  })
})

socket.on('notify', (sender) => {
  notifyMe(sender);
  $scope.notification = true;
  var newNotification = {
    sender: {
      image: sender.image,
      name: sender.name
    },
    idea: {
      _id: sender.ideaId,
      name: sender.idea
    },
    pivot: sender.pivot,
    type: sender.type
  }
  $scope.currentUser.notifications.push(newNotification);
})

function notifyMe(sender) {
  var notification_message;
  $scope.notification = true;
  switch (sender.type) {
    case 'money':
    notification_message = ' says "I buy it!" on your '
    break;
    case 'love':
    notification_message = ' says "I love it!" on your '
    break;
    case 'like':
    notification_message = ' says "Not bad" on your '
    break;
    case 'dislike':
    notification_message = ' says "I don\'t like it" on your '
    break;
    default:
    notification_message = " commented on your "
    break;
  }
  var options = {
    body: sender.name + notification_message + $filter('enumeration')(sender.pivot) + " of "+sender.idea,
    icon: sender.image
  }
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.")
  }
  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Wetopia", options);
  }
  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Wetopia", options);
      }
    })
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother them any more.
}

})
