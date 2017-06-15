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
        else{
          return input+"th Pivot";
        }
      };
    })
    .controller('myIdeaCtrl', function($scope, $window, localStorageService, $http, $state, ideaDataService, categoriesDataService, $filter, $stateParams) {
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
        var currentComment = "";
        var commentIndex = "";
        $scope.currentUser = {};
        var user_id = localStorageService.get('user_id');
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');
        $scope.currentPivot = 1;
        $scope.pivotSelected = $filter('enumeration')($scope.currentPivot);
        $scope.members = [];
        $scope.descriptionError = false;

        $scope.giveStartToFeedback = function(feedback_id){
          ideaDataService.giveStartToFeedback(idea_id, feedback_id, function(response){
            if(response.status==201){
              $scope.getIdea($scope.currentPivot);
            }
          }, function(response){
            switch (response.status) {
              case 400:
                ideaDataService.deleteStartToFeedback(idea_id, feedback_id, function(response){
                  if(response.status==201){
                    $scope.getIdea($scope.currentPivot);
                  }
                })
                break;
            }
          })
        }

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.data){
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data;
              if($scope.idea.admin._id != user_id){
                $state.go('idea', {idea_id:idea_id});
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
                  $scope.idea.stats = stats;
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

        $scope.giveStartToFeedback = function(feedback_id, index){
          ideaDataService.giveStartToFeedback(idea_id, feedback_id, function(response){
            if(response.status==201){
              $scope.idea.feedback[index].stars.push(response.data);
            }
          }, function(response){
            switch (response.status) {
              case 400:
                ideaDataService.deleteStartToFeedback(idea_id, feedback_id, function(response){
                  if(response.status==201){
                      $scope.idea.feedback[index].stars.splice(commentIndex, 1);
                  }
                })
                break;
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
              $scope.idea.feedback.splice(commentIndex, 1);
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
            console.log(response);
          });
        }

        $scope.updateIdea = function(){
          if(!$scope.idea.description){
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
            banner: $scope.idea.banner,
            problem: $scope.idea.problem,
            description: $scope.idea.description,
            country: $scope.idea.country,
            members: $scope.members
          }
          ideaDataService.updateIdeaInformation(idea_id, $scope.currentPivot, newInformation, function(response){
            if(response.status!=200){
              window.alert("There was a problem. Please, try again later.");
            }
          })
          }
        }

        $scope.getBannerImage = function(category){
          return $scope.categoriesBanner[category].banner;
        }

        $scope.copy = function (type){
          if(type=='idea'){
            if($scope.newIdea!=$scope.idea.description){
              $scope.newIdea = $scope.idea.description;
            }
            else{
              $scope.newIdea = "";
            }

          }
          else if(type=='problem'){
            if($scope.newProblem!=$scope.idea.problem){
              $scope.newProblem = $scope.idea.problem;
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

        $scope.updateIdeaInfo = function(){
          $scope.editIdea = false;
          console.log("puchale");
        }

    })
