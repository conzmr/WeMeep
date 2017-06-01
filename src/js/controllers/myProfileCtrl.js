angular.module('wetopiaApp')
    .controller('myProfileCtrl', function($scope, localStorageService, profileDataService, $stateParams, $location, Upload, ideaDataService, $state, categoriesDataService) {
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
        $scope.categoriesBanner = categoriesDataService.categories;
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

      var getBannerImage = function(category){
        return $scope.categoriesBanner[category].banner;
      }

      $scope.updateProfileInfo = function(){
        let newUserInformation = {
          name: $scope.user.name,
          lastname: $scope.user.lastname,
          profession: $scope.user.profession,
          birthdate: Date.parse($scope.dateOfBirth),
          gender: $scope.user.gender,
          location: $scope.user.location,
          bio: $scope.user.bio
        }
        $scope.editProfile = false;
	 if ($scope.user.image){
            Upload.upload({
                    url: window.HOST + '/api/upload',
                    data: {
                        file: $scope.user.image
                    }
                })
                .then(function(res) { //upload function returns a promise
		                profileDataService.updateProfilePicture(res.data.file_name, function(response){
                      console.log(response.status);
                    })
                }, function(errRes) { //catch error
                    $window.alert('Error status: ' + errRes.status);
                });
          }
        profileDataService.updateProfileInfo(username, newUserInformation, function(response){
          console.log(response.status);
          console.log(response.data);
        }).then(updateAgeViews());
      }

      function convertToYears( date ){
        const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
        var years = Math.floor((Date.now() - date) / MS_PER_YEAR);
        return years;
      }

      function convertToTimestamp (date){
        var date = new Date(date);
        return date;
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

function updateAgeViews() {
  if($scope.user.birthdate){
    $scope.age = convertToYears($scope.user.birthdate)+" years";
    $scope.dateOfBirth = convertToTimestamp($scope.user.birthdate);
  }
}

profileDataService.getProfileInfo(username, function(response) {
  if(response.status==200){
    $scope.user = response.data.user;
    updateAgeViews();
    var obj = response.data.user.testResults;
    calculateResults(obj);
    for(var i = 0; i < $scope.user.ideas.length; i++){
      var j =0;
      ideaDataService.getIdeaInformation($scope.user.ideas[i], 1, function(response){
        if(response.data){
          $scope.ideasData[j] = response.data;
          for(var i =0; i< response.data.members.length; i++){
            if(response.data.members[i]._id == response.data.admin){
              $scope.ideasData[j].admin = response.data.members[i];
            }
          }
          j++;
          return j-1;
        }
      })
      .then(
    function(response){
      categoriesDataService.getCategories(function(res){
        for(var i=0; i< res.data.length; i++){
          if(res.data[i]._id == $scope.ideasData[response].category){
            $scope.ideasData[response].category = res.data[i];
            if($scope.ideasData[response].banner == undefined){
                $scope.ideasData[response].banner = getBannerImage(res.data[i].name);
            }
          }
        }
      })
    },
    function(failureResponse){
      console.log(failureResponse);
    }
  )
    }
  }
  else {
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
