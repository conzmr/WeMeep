angular.module('wetopiaApp')
      .filter('enumeration', function($filter){
        return function(input)
        {
          if(input == null){ return ""; }
          else if(input == 1){
            return input+"st Pivot";
          }
          else if(input == 2){
            return input+"nd Pivot";
          }
          else if(input == 3){
            return input+"rd Pivot";
          }
          else{
            return input+"th Pivot";
          }
        };
      })
    .controller('ideaCtrl', function($scope, ideaDataService, $state, $filter, $stateParams, categoriesDataService, localStorageService, notificationDataService, socket) {
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.like = "";
        $scope.interestShowed = false;
        $scope.likeFeedback = false;
        $scope.categoriesBanner = categoriesDataService.categories;
        var idea_id= $stateParams.idea_id;
        var pivot_number = $stateParams.pivotNumber;
        var user_id = localStorageService.get('user_id');
        $scope.currentUser = {};
        $scope.currentPivot = pivot_number;
        var currentComment = "";
        var commentIndex = "";
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');
        $scope.currentUser.name = localStorageService.get('name');
        $scope.currentUser.id = localStorageService.get('user_id');
        $scope.currentUser.notifications = [];
        getNotifications();

        $scope.logOut = function(){
          localStorageService.clearAll();
          $state.go('landing');
        }

        $scope.wantoToDeleteFeedback = function(comment_id, index){
          $scope.wantToDeleteComment = true;
          currentComment = comment_id;
          commentIndex = index;
        }

        $scope.deleteFeedback = function(){
          ideaDataService.deleteFeedback(currentComment, function(response){
            if(response.status==200){
              $scope.pivot.feedback.splice(commentIndex, 1);
            }
          })
          $scope.wantToDeleteComment = false;
          $scope.deletedComment = true;
        }

        $scope.giveStarToFeedback = function(feedback_id, index){
          ideaDataService.giveStarToFeedback(idea_id, feedback_id, function(response){
            if(response.status==201){
              $scope.pivot.feedback[index].stars.push(response.data);
            }
            else if(response.status == 200){
              $scope.pivot.feedback[index].stars.splice(commentIndex, 1);
            }
          })
        }

        function getLike(){
          ideaDataService.getLike(idea_id, $scope.currentPivot, function(response){
            if(response.data.interest){
                $scope.like = response.data.interest.interests[0].type;
            }
            else{
              $scope.like ="";
            }
          })
        }

        $scope.giveLike =function(){
          let like = {
            interest: $scope.like,
            comment: $scope.whyInterest
          }
          ideaDataService.giveLike(idea_id, $scope.currentPivot, like, function(response){
            if(response.status == 200){
              pushNotification(like.interest);
              $scope.likeFeedback = false;
              $scope.interestShowed = true;
            }
          })
        }

        $scope.giveFeedback = function(){
          if($scope.newComment){
            let newComment = {
              text : $scope.newComment
            };
            ideaDataService.giveFeedback(idea_id, $scope.currentPivot, newComment, function(response){
              pushNotification('comment');
              $scope.pivot.feedback.push(response.data.feedback);
              $scope.newComment = "";
            })
          }
        }

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.status==200){
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data.idea;
              $scope.pivot = response.data.pivot;
              $scope.interestShowed = false;
              getLike();
              $scope.pivotSelected = $filter('enumeration')(pivotNumber);
              if($scope.idea.admin._id == user_id){
                $state.go('myIdea', {idea_id:idea_id, pivotNumber: pivotNumber});
              }
            }
          }, function(res){
                $state.go('home');
          })
        }

        $scope.getIdea($scope.currentPivot);

        var getBannerImage = function(category){
          return $scope.categoriesBanner[category].banner;
        }

        $scope.changeLike = function(like){
          if($scope.like==like){
            let deleteLike = {
              interest: $scope.like
            }
            $scope.likeFeedback = false;
            ideaDataService.giveLike(idea_id, $scope.currentPivot, deleteLike, function(response){
              if(response.status == 200){
                  $scope.like = "";
              }
            })
          }
          else{
            $scope.like = like;
            $scope.likeFeedback = true;
          }
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

        $scope.changeShowPivots = function(){
          $scope.showPivots = !$scope.showPivots;
        }

        function pushNotification(type){
          let sender = {
            userId: $scope.idea.admin._id,
            username: $scope.currentUser.username,
            image: $scope.currentUser.image,
            name:  $scope.currentUser.name,
            idea: $scope.idea.name,
            ideaId: $scope.idea._id,
            pivot: $scope.currentPivot,
            type: type
          }
          createNotification(type);
          socket.emit('new_notification', sender)
        }

        function createNotification(type){
          let notification = {
            type: type,
            idea: $scope.idea._id,
            members: $scope.idea.members,
            pivot: $scope.currentPivot
          }
          notificationDataService.createNewNotification(notification, function(response){
            console.log(response);
          })
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
