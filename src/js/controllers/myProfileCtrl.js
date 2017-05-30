angular.module('wetopiaApp')
    .controller('myProfileCtrl', function($scope, localStorageService, profileDataService, $stateParams, $location, ideaDataService, $state) {
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.ideas = true;
        $scope.projects = false;
        $scope.following = false;
        $scope.editProfile = false;
        $scope.showSelectGender = false;
        $scope.usernameError=false;
        $scope.ideasData = [];
        var adminsData = [];
        $scope.testResults = [];
        var username = localStorageService.get('username');
        $location.path('/profile/'+username).replace();

        var calculateResults = function (obj) {
          for( var key in obj ) {
            if ( obj.hasOwnProperty(key) ) {
            $scope.testResults.push(obj[key]);
          }
        }
      }

        $scope.selectGender = function(gender){
          $scope.user.gender = gender;
          $scope.showSelectGender = false;
        }

        $scope.changeShowSelectGender = function(){
          $scope.showSelectGender = !$scope.showSelectGender;
        }

        $scope.showIdeas = function(){
          $scope.ideas = true;
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
        }

        $scope.changeShowMenu = function(){
          $scope.showUserMenu = !$scope.showUserMenu;
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

$scope.data = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
  //[65, 59, 90, 81, 56, 55, 40, 30, 12]
];

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

$stateParams.username = username;

// var getAllIdeasInformation = function(ideas){
//   for(var i =0; i< ideas.length; i++){
//       ideaDataService.getIdeaInformation($scope.user.ideas[i], function(response){
//         console.log(response);
//       });
//   }
// }
//
// var getUserInformation = function(){
//
//     profileDataService.getProfileInfo(username, function(response){
//       $scope.user = response.data.user;
//     }).then(getAllIdeasInformation(response.data.user.ideas));
//
//
// }
//
// getUserInformation();

profileDataService.getProfileInfo(username, function(response) {
  if(response.status==200){
    $scope.user = response.data.user;
    var obj = response.data.user.testResults;
    calculateResults(obj);
    for(var i = 0; i < $scope.user.ideas.length; i++){
      var j =0;
      ideaDataService.getIdeaInformation($scope.user.ideas[i], function(response){
        if(response.data){
          // $scope.ideasData[j] = response.data;
          $scope.ideasData[j] = {};
          $scope.ideasData[j].name = response.data.name;
          $scope.ideasData[j].banner = response.data.banner;
          $scope.ideasData[j].description = response.data.description;
          $scope.ideasData[j].admin = response.data.admin;
          $scope.ideasData[j].category = response.data.category;
          // $scope.ideasData[j].admin = profileDataService.getProfileInfo(response.data.admin, function(res){
          //   if(res.data){
          //     console.log(res.data.user.name);
          //     return res.data.user.name;
          //   }
          // })
          console.log($scope.ideasData[j]);
          // console.log($scope.ideasData[j]);
          // profileDataService.getProfileInfo(response.data.admin, function(res){
          //   if(res.data){
          //   console.log(res.data);
          //   console.log($scope.ideasData[j]);
          //
          //     // $scope.ideasData[j].admin = {
          //     //   name: res.data.user.name,
          //     //   lastname: res.data.user.lastname
          //     // }
          //   }
          // })
          j++;
        }
      })
    }
  }
  else {
    $scope.user = {};
    $state.go('home');
  }
});

$scope.uploadAvatar = function(file){
      Upload.upload({
      url: window.HOST + '/api/users/' + $scope.user._id + '/avatar',
      data:{ file: file }
    }).then(function (res) { //upload function returns a promise
          $scope.user.image = res.data.path
      }, function (errRes) { //catch error
          $window.alert('Error status: ' + errRes.status);
    });
}


            })
