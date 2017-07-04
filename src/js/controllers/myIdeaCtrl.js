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
    .controller('myIdeaCtrl', function($scope, $window, localStorageService, $http, $state, Upload, ideaDataService, categoriesDataService, $filter, $stateParams, notificationDataService, socket) {
        $scope.pivoting = false;
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        $scope.editIdea = false;
        $scope.inputTeamMembers = false;
        $scope.wantToDiscard = false;
        $scope.whyDiscard = false;
        $scope.discarded = false;
        $scope.saved = false;
        $scope.ideaNameError = false;
        $scope.categoriesBanner = categoriesDataService.categories;
        var idea_id= $stateParams.idea_id;
        var pivotNumber= $stateParams.pivotNumber;
        var currentComment = "";
        var commentIndex = "";
        $scope.currentUser = {};
        var user_id = localStorageService.get('user_id');
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');
        $scope.currentUser.notifications = [];
        $scope.currentPivot = pivotNumber;
        $scope.pivotSelected = $filter('enumeration')($scope.currentPivot);
        $scope.members = [];
        $scope.descriptionError = false;
        getNotifications();

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          $scope.showPivotsModal = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.status==200){
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data.idea;
              $scope.pivot = response.data.pivot;
              $scope.pivotSelected = $filter('enumeration')(pivotNumber);
              if($scope.idea.admin._id != user_id){
                $state.go('idea', {idea_id:idea_id, pivotNumber: pivotNumber});
              }
              else{
                ideaDataService.getIdeaStats(idea_id, pivotNumber, function(response){
                  let data = response.data[0];
                  let stats = {
                    dislike : 0,
                    like: 0,
                    love: 0,
                    money: 0
                  }
                  for(var i=0; i<data.length; i++){
                    if(data[i]._id == 'dislike'){
                      stats.dislike = data[i].count;
                    }
                    if(data[i]._id == 'like'){
                      stats.like = data[i].count;
                    }
                    if(data[i]._id == 'love'){
                      stats.love = data[i].count;
                    }
                    if(data[i]._id == 'money'){
                      stats.money = data[i].count;
                    }
                  }
                  $scope.pivot.stats = stats;
                })
              var j=0;
              for(var i =0; i < $scope.idea.members.length; i++){
                if($scope.idea.members[i].username != $scope.idea.admin.username){
                  $scope.members[j] = $scope.idea.members[i];
                  j++;
                }
              }
                }
            }
          }, function(res){
            switch (res.status) {
              case 404:
                $state.go('home');
                break;
            }
          })
        }

        $scope.goHome = function(modal){
          if(modal == "discarded" && $scope.discarded ){
              $state.go('home');
          }
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

        $scope.toDelete = function(){
          $scope.whyDiscard = true;
          $scope.wantToDiscard = false;
        }

        $scope.deleteIdea = function(){
          $scope.whyDiscard = false;
          $scope.discarded = true;
          let comment = {
            comment : $scope.whyDeleted
          }
          ideaDataService.deleteIdea(idea_id, $scope.currentPivot, comment, function(response){
          });
        }

        $scope.updateIdea = function(){
          if(!$scope.pivot.description){
            $scope.descriptionError=true;
          }
          if(!$scope.idea.name){
            $scope.ideaNameError=true;
          }
          else if($scope.idea.name&&$scope.idea.description){
          $scope.editIdea = false;
          $scope.descriptionError = false;
          $scope.ideaNameError =false
          $scope.ideaNameError= false;
          $scope.members.push($scope.idea.admin);
          let newInformation = {
            name: $scope.idea.name,
            banner: $scope.idea.banner,
            problem: $scope.pivot.problem,
            description: $scope.pivot.description,
            country: $scope.idea.country,
            members: $scope.members
          }
          if (!isString($scope.idea.banner)&&$scope.idea.banner!=undefined){
                   Upload.upload({
                           url: window.HOST + '/api/upload',
                           data: {
                               file: $scope.idea.banner
                           }
                       })
                       .then(function(res) {
                         if(res.data.file_name){
                           newInformation.banner = '/static/uploads/'+ res.data.file_name;
                         }
                         ideaDataService.updateIdeaInformation(idea_id, $scope.currentPivot, newInformation, function(response){
                           if(response.status!=200){
                             window.alert("There was a problem. Please, try again later.");
                           }
                         })
                     }, function(errRes) {
                       console.log(errRes);
                     });
          }
          ideaDataService.updateIdeaInformation(idea_id, $scope.currentPivot, newInformation, function(response){
            if(response.status!=200){
              window.alert("There was a problem. Please, try again later.");
            }
          })
          }
        }

        function isString (obj) {
          return (Object.prototype.toString.call(obj) === '[object String]');
        }

        $scope.getBannerImage = function(category){
          return $scope.categoriesBanner[category].banner;
        }

        $scope.copy = function (type){
          if(type=='idea'){
            if($scope.newIdea!=$scope.pivot.description){
              $scope.newIdea = $scope.pivot.description;
            }
            else{
              $scope.newIdea = "";
            }

          }
          else if(type=='problem'){
            if($scope.newProblem!=$scope.pivot.problem){
              $scope.newProblem = $scope.pivot.problem;
            }
            else{
              $scope.newProblem ="";
            }
          }
        }

        $scope.loadMembers = function($query) {
            return $http.get(HOST + '/api/members/' + user_id, {
                cache: true
            }).then(function(response) {
                var members = response.data;
                return members.filter(function(member) {
                    return member.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }

        $scope.createNewPivot = function (){
          if(!$scope.newIdea){
            $scope.pivotDescriptionError = true;
          }
          if ($scope.newIdea) {
            let newPivotInfo = {
              description: $scope.newIdea,
              problem : $scope.newProblem
            }
            ideaDataService.createNewPivot(idea_id, newPivotInfo, function(response){
              if(response.status!=201){
                window.alert("There was a problem. Please, try again later. "+response.status);
              }
              $scope.newIdea="";
              $scope.newProblem="";
              $scope.pivoting = false;
              $scope.pivotDescriptionError = false;
            })
          }
        }

        $scope.getIdea($scope.currentPivot);

        $scope.saveIdea = function(){
          $scope.wantToDiscard=false;
          $scope.saved=true;
        }

        $scope.logOut = function(){
          localStorageService.clearAll();
          $state.go('landing');
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

        $scope.selectPivot = function(pivot){
          $scope.pivotSelected = pivot;
          $scope.showPivots = false;
        }

        $scope.changeShowPivots = function(){
          $scope.showPivots = !$scope.showPivots;
        }

        $scope.changeShowPivotsModal = function(){
          $scope.showPivotsModal = !$scope.showPivotsModal;
        }

        $scope.updateIdeaInfo = function(){
          $scope.editIdea = false;
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
            notification_message = " says I buy it! to your "
            break;
            case 'love':
            notification_message = " says I love it! to your "
            break;
            case 'like':
            notification_message = " says Not bad to your "
            break;
            case 'dislike':
            notification_message = " says I don't like it to your"
            break;
            default:
            notification_message = " commented your "
            break;
          }
          var options = {
            body: sender.name + notification_message + $filter('enumeration')(sender.pivot) + " on "+sender.idea,
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
