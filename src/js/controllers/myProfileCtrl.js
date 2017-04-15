angular.module('musementApp')
    .controller('myProfileCtrl', function($scope) {
        $scope.notification = false;
        $scope.showNotifications=false;
        $scope.showUserMenu=false;
        $scope.ideas = true;
        $scope.projects = false;
        $scope.following = false;

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
  //[0, 0, 0, 0, 0, 0, 0, 0, 0]
  [65, 59, 90, 81, 56, 55, 40, 30, 12]
];

$scope.scoreCategories = [{ //colors needed
  name: 'Art',
  color: '#F26649',
  percentage:'80%'
},{
  name: 'Design',
  color: '#E6BA83',
  percentage:'37%'
},{
  name: 'Ecological',
  color: ' #00A9CD',
  percentage:'54%'
},{
  name: 'Education',
  color: '#03A9CD',
  percentage:'60%'
},{
  name: 'Fashion',
  color: '#b8e986',
  percentage:'12%'
},{
  name: 'Film & Fotography',
  color: '#FBC326',
  percentage:'38%'
},{
  name: 'Finances',
  color: '#EF4136',
  percentage:'74%'
},{
  name: 'Food',
  color: '#00A8CB',
  percentage:'39%'
},{
  name: 'Games',
  color: '#8DC63F',
  percentage:'10%'
},{
  name: 'Hand Craft',
  color: '#00B1B0',
  percentage:'94%'
},{
  name: 'Health',
  color: '#f48465',
  percentage:'50%'
},{
  name: 'Social',
  color: '#E6BA83',
  percentage:'31%'
},{
  name: 'Technological',
  color: '#f48465',
  percentage:'13%'
},{
  name: 'Others',
  color: ' #00A9CD',
  percentage:'85%'
}
];


            })
