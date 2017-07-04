angular.module('wetopiaApp')
.controller('profileCtrl', function($scope, $rootScope,signupDataService, $document, $location, $stateParams, profileDataService, Upload, $state, $window, $filter, localStorageService, categoriesDataService, ideaDataService, notificationDataService, socket) {
  $scope.notification = false;
  $scope.showNotifications=false;
  $scope.showUserMenu=false;
  // $scope.ideas = true;
  $scope.projects = false;
  $scope.following = false;
  $scope.editProfile = false;
  $scope.user = {};
  $scope.currentUser = {};
  $scope.currentUser.email = localStorageService.get('email');
  $scope.currentUser.username = localStorageService.get('username');
  $scope.currentUser.image = localStorageService.get('image');
  $scope.user.notifications = [];
  $scope.categoriesBanner = categoriesDataService.categories;
  $scope.testDone = false;
  $scope.ideasData = [];
  $scope.testResults = [];
  var username= $stateParams.username;
  getNotifications();

  $scope.getBannerImage = function(category){
    return $scope.categoriesBanner[category].banner;
  }

  $scope.logOut = function(){
    localStorageService.clearAll();
    $state.go('landing');
  }

  var calculateResults = function (obj) {
    for( var key in obj ) {
      if ( obj.hasOwnProperty(key) ) {
      $scope.testResults.push(obj[key]);
    }
  }
}


  $scope.showIdeas = function(){
    // $scope.ideas = true;
    $scope.following = false;
    $scope.projects = false;
  }

  $scope.showProjects = function(){
    $scope.ideas = false;
    $scope.following = false;
    $scope.projects = true;
  }

  $scope.showFollowing = function(){
    $scope.ideas = false;
    $scope.following = true;
    $scope.projects = false;
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
      console.log(response);
    })
  }

  $scope.changeShowMenu = function(){
    $scope.showUserMenu = !$scope.showUserMenu;
  }

  function goToInnerNavSection() {
    var section = angular.element(document.getElementById('userSection'));
    $document.scrollToElement(section, 550, 1000);
};


   var goToSection= $stateParams.section;

   if(goToSection){
     goToInnerNavSection();
     if(goToSection=="ideas"){
      //  $scope.ideas=true;
      console.log('here');
      $location.path('/profile/'+username+'/ideas').replace();
     }
   }


  $scope.colors = [
      {
        backgroundColor: "#f48465",
        pointBackgroundColor: "rgba(250,109,33,0)",
        pointHoverBackgroundColor: "rgba(250,109,33,0)",
        borderColor: "#f48465",
        pointBorderColor: "rgba(250,109,33,0)",
        pointHoverBorderColor: "rgba(250,109,33,0)"
      },"rgba(250,109,33,0)","#9a9a9a","rgb(233,177,69)"
    ];

    $scope.options =       {
      tooltips:{
        enabled: false
      },

  scale: {
    gridLines:{
      color: '#9B9B9B',
      lineWidth: 1,
      zeroLineWidth: 30,
      zeroLineColor: '#8DC63F'
    },
    ticks: { beginAtZero: !0, display: !1 },
  pointLabels:{
      fontSize: 15,
      fontColor: '#9B9B9B'
  },
  angleLines:{
    display:false
  },
}
  }

Chart.defaults.global.responsive = true;
Chart.defaults.global.defaultFontColor="#9B9B9B";
Chart.defaults.global.defaultFontFamily="Museo_700";
Chart.defaults.global.defaultFontSize="16";

  $scope.labels =["Specialist", "Creative", "Coordinator", "Manager", "Networker", "Researcher", "Support", "Analyzer", "Perfectionist"];


$scope.scoreCategories = [{
name: 'Art',
color: '#009EBF',
percentage:'80%'
},{
name: 'Design',
color: '#00ABBE',
percentage:'37%'
},{
name: 'Ecological',
color: ' #64BEBD ',
percentage:'54%'
},{
name: 'Education',
color: '#E1B782 ',
percentage:'60%'
},{
name: 'Fashion',
color: '#CE985E',
percentage:'12%'
},{
name: 'Film & Fotography',
color: '#EA8164',
percentage:'38%'
},{
name: 'Finances',
color: '#E66449',
percentage:'74%'
},{
name: 'Food',
color: '#009EBF',
percentage:'39%'
},{
name: 'Games',
color: '#00ABBE',
percentage:'10%'
},{
name: 'Hand Craft',
color: '#64BEBD',
percentage:'94%'
},{
name: 'Health',
color: '#E1B782',
percentage:'50%'
},{
name: 'Social',
color: '#CE985E',
percentage:'31%'
},{
name: 'Technological',
color: '#EA8164',
percentage:'13%'
},{
name: 'Others',
color: ' #E66449',
percentage:'85%'
}
];

function convertToYears( date ){
  const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
  var years = Math.floor((Date.now() - date) / MS_PER_YEAR);
  return years;
}

 profileDataService.getProfileInfo(username, function(response) {
   if(response.status==200){
     if(response.data.user==null){
       $state.go('home');
     }
     else{
     $scope.user = response.data.user;
     var obj = response.data.user.testResults;
     calculateResults(obj);
     for(var i = 0; i < $scope.user.ideas.length; i++){
       var j =0;
       ideaDataService.getIdeaInformation($scope.user.ideas[i], 1, function(response){
         if(response.data.idea){
           $scope.ideasData[j] = response.data.idea;
           j++;
         }
       })
     }
      }
   }
   else {
     $state.go('home');
   }
 });

 function getNotifications(){
   notificationDataService.getNotifications(function(response){
     if(response.data['new notification']){
       $scope.notification = true;
     }
     $scope.user.notifications = response.data.notifications;
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
