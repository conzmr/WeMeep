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
        $scope.currentUser = {};
        var user_id = localStorageService.get('user_id');
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');
        $scope.currentUser.image = localStorageService.get('image');
        $scope.currentPivot = 1;
        $scope.pivotSelected = $filter('enumeration')($scope.currentPivot);
        $scope.members = [];
        $scope.descriptionError = false;


        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.data){
              $scope.currentPivot = pivotNumber;
              $scope.idea = response.data;
              if($scope.idea.admin.username != $scope.currentUser.username){
                $state.go('idea', {idea_id:idea_id});
              }
              var j=0;
              for(var i =0; i < $scope.idea.members.length; i++){
                if($scope.idea.members[i].username != $scope.idea.admin.username){
                  $scope.members[j] = $scope.idea.members[i];
                  j++;
                }
              }
            }
          })
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

        $scope.getIdeaStats = function (){
          ideaDataService.getIdeaStats(idea_id, function(response){
            console.log('hed idea');
            console.log(response);
          })
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

        $scope.discardIdea = function(){
          $scope.wantToDiscard = false;
          $scope.whyDiscard = true;
        }

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
