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
    .controller('myIdeaCtrl', function($scope, localStorageService, ideaDataService, categoriesDataService, $filter, $stateParams) {
        $scope.pivoting = false;
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.showPivots = false;
        // $scope.pivots = ['1st Pivot', '2nd Pivot', '3th Pivot'];
        // $scope.pivotSelected = $filter('enumeration')($scope.pivotSelected);
        // $scope.newPivot=$scope.pivots.length+1;
        $scope.wantToDiscard = false;
        $scope.whyDiscard = false;
        $scope.discarded = false;
        $scope.saved = false;
        $scope.categoriesBanner = categoriesDataService.categories;
        var idea_id= $stateParams.idea_id;
        $scope.currentUser = {};
        $scope.currentUser.email = localStorageService.get('email');
        $scope.currentUser.username = localStorageService.get('username');

        $scope.getIdea = function(pivotNumber){
          $scope.showPivots = false;
          ideaDataService.getIdeaInformation(idea_id, pivotNumber, function(response){
            if(response.data){
              $scope.pivotSelected = $filter('enumeration')(pivotNumber);
              $scope.idea = response.data;
            }
          })
          // ideaDataService.getIdeaStats(idea_id, function(response){
          //   console.log('hed');
          //   console.log(response.status);
          //   console.log(response);
          //   console.log(response.data);
          // })
        }

        $scope.getIdea(1);

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

        $scope.feedback = [{
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 12,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 7,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 2,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 0,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        },
        {
          firstname : "FirstName",
          username : "Username",
          img : "/static/img/PROJECT_VIEWS/User_ICON.svg",
          stars: 8,
          comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit ex massa, et pellentesque enim blandit ac."
        }
      ]

    })
